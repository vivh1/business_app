import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .forms import UserUpdateForm, ProfileUpdateForm
from .jwt_utils import get_tokens_for_user

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

    from django.contrib.auth.models import User

    # Check if username already exists
    if User.objects.filter(username=username).exists():
        return JsonResponse(
            {"success": False, "message": "Username already exists"},
            status=400
        )

    # Check email if you want
    if email and User.objects.filter(email=email).exists():
        return JsonResponse(
            {"success": False, "message": "Email already registered"},
            status=400
        )

    # Create user
    user = User.objects.create_user(
        username=username,
        email=email or "",
        password=password
    )

    # Also create profile automatically (your signals.py already does this)
    # so no need to handle Profile creation manually

    return JsonResponse({
        "success": True,
        "message": "Account created successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        },
        "tokens": tokens
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
    email = data.get("email") # Added this just to allow the email to be visible in the Profile Settings, thx - Cyel

    if not username or not password:
        return JsonResponse(
            {"success": False, "message": "Username and password required"},
            status=400
        )

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse(
            {"success": False, "message": "Invalid credentials"},
            status=400
        )

    # Create session cookie
    tokens = get_tokens_for_user(user)

    # Shape the JSON to match what your JS expects:
    return JsonResponse({
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email, # Also added this for the same reason as the other email related one - Cyel
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
