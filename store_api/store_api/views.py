from django.http import JsonResponse
from django.shortcuts import render

def frontend(request):
    return render(request, "index.html")

def home(request):
    return JsonResponse({"message": "API is working"})
