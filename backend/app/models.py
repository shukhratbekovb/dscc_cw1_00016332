from django.contrib.auth.models import User
from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=256)
    description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Tags"


class Todo(models.Model):
    STATUS = (
        (
            "process", "Process"
        ),
        (
            "completed", "Completed"
        ),
        (
            "new", "New"
        ),
        (
            "canceled", "Canceled"
        )
    )

    title = models.CharField(max_length=256)
    description = models.TextField(null=True, blank=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    status = models.CharField(max_length=20, choices=STATUS, default="new")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Todos"
