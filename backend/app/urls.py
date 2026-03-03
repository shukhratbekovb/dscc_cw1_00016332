from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TagViewSet, TodoViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'todos', TodoViewSet, basename='todo')

urlpatterns = router.urls
