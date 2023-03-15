from django.contrib import admin
from django.urls import path, include
from api import views
from rest_framework import routers

urlpatterns = [
    path('admin/', admin.site.urls),
]


router = routers.DefaultRouter()

# In the router we are adding the endpoints to the viewsets

router.register('personas', views.PersonaViewSet)
urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('admin/', admin.site.urls),
]
