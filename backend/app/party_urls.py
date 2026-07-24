from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .party_views import PartyViewSet

router = DefaultRouter()
router.register(r'parties', PartyViewSet, basename='party')

urlpatterns = [
    path('', include(router.urls)),
]
