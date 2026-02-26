import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .forms import UserUpdateForm, ProfileUpdateForm
from .repositories import userRepository
from .services import authenticationService
from .services import tokenService
from .services import userService

user_repository = userRepository()
token_service = tokenService()
user_service = userService(user_repository)
auth_service = authenticationService(user_repository)

@csrf_exempt
def register_api(request):
    if request.method != "POST":
        return JsonResponse(
            {"success": False, "message": "Method not allowed"},
            status=405
        )

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse(
            {"success": False, "message": "Invalid JSON"},
            status=400
        )

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Basic validation
    if not username or not password:
        return JsonResponse(
            {"success": False, "message": "Username and password required"},
            status=400
        )

    # Create user
    result = auth_service.register(username,email,password)

    # JsonResponse
    return JsonResponse({
        "success": result.success,
        "message": result.message
    })

@csrf_exempt
def login_api(request):
    if request.method != "POST":
        return JsonResponse(
            {"success": False, "message": "Method not allowed"},
            status=405
        )

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse(
            {"success": False, "message": "Invalid JSON"},
            status=400
        )

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse(
            {"success": False, "message": "Username and password required"},
            status=400
        )

    user = auth_service.login(username,password)
    if user is None:
        return JsonResponse(
            {"success": False, "message": "Invalid credentials"},
            status=401
        )

    tokens = token_service.give_tokens(user)

    # Shape the JSON to match what your JS expects:
    return JsonResponse({
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "is_admin": user.is_staff or user.is_superuser,
        },
        "tokens": tokens
    })

@csrf_exempt
def logout_api(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    logout(request)
    return JsonResponse({"detail": "logged out"})

@csrf_exempt
def users_api(request):
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    user_list = user_service.get_all_users()

    users_data = [{"username": user.username, "email": user.email,"admin": user.is_superuser} for user in user_list]

    return JsonResponse({"users": users_data})

@csrf_exempt
def update_api(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse(
            {"success": False, "message": "Invalid JSON"},
            status=401
        )

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    usid = data.get("id")

    print(username,email,password,usid)

    username_check = user_service.update_user(username,password,email,usid)

    if username_check is None:
           return JsonResponse(
            {"success": False, "message": "Invalid User"},
            status=401
        )     

    user = user_service.get_by_username(username)

    return JsonResponse({"success": True, 
        "user":{"username": user.username,
                "email":user.email,
                },    
    })

@login_required
@csrf_exempt  # later you can replace this with proper CSRF/JWT handling
def profile_api(request):
    if request.method == "GET":
        # Return current user/profile data so the SPA can fill the form
        u_form = UserUpdateForm(instance=request.user)
        p_form = ProfileUpdateForm(instance=request.user.profile)

        return JsonResponse({
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                **u_form.initial,  # if you want form-initial values merged
            },
            "profile": p_form.initial,
        })

    if request.method in ["POST", "PATCH"]:
        # Update user/profile with data from the frontend
        if request.content_type == "application/json":
            data = json.loads(request.body.decode("utf-8"))
            # split user vs profile fields however your forms are defined
            u_form = UserUpdateForm(data.get("user", {}), instance=request.user)
            p_form = ProfileUpdateForm(data.get("profile", {}), instance=request.user.profile)
            files = None
        else:
            # form-data (e.g. for file uploads)
            u_form = UserUpdateForm(request.POST, instance=request.user)
            p_form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile)

        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            return JsonResponse({
                "detail": "Your profile has been updated!",
                "user": u_form.cleaned_data,
                "profile": p_form.cleaned_data,
            })

        # If invalid, return errors instead of re-rendering template
        return JsonResponse({
            "errors": {
                "user": u_form.errors,
                "profile": p_form.errors,
            }
        }, status=400)

    # Method not allowed
    return JsonResponse({"detail": "Method not allowed"}, status=405)
