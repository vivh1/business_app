from django.http import JsonResponse
from functools import wraps

def admin_required(view_func):
    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return JsonResponse({"detail": "Authentication required"}, status=401)
        if not (user.is_staff or user.is_superuser):
            return JsonResponse({"detail": "Admin only"}, status=403)
        return view_func(request, *args, **kwargs)
    return _wrapped
