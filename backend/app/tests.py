from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Project


class ProjectAPITest(APITestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(
            username="user1",
            password="1234"
        )
        self.user2 = User.objects.create_user(
            username="user2",
            password="1234"
        )

        # создаём проекты
        self.project1 = Project.objects.create(
            name="Project 1",
            description="Desc 1",
            user=self.user1
        )

        self.project2 = Project.objects.create(
            name="Project 2",
            description="Desc 2",
            user=self.user2
        )

        self.url = "/api/projects/"

    def test_user_sees_only_own_projects(self):
        self.client.login(username="user1", password="1234")

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.project1.pk)

    def test_create_project_sets_user_automatically(self):
        self.client.login(username="user1", password="1234")

        response = self.client.post(self.url, {
            "name": "New Project",
            "description": "Test"
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 3)

        new_project = Project.objects.get(name="New Project")
        self.assertEqual(new_project.user, self.user1)

    def test_user_cannot_retrieve_other_user_project(self):
        self.client.login(username="user1", password="1234")

        response = self.client.get(f"{self.url}{self.project2.pk}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_update_other_user_project(self):
        self.client.login(username="user1", password="1234")

        response = self.client.put(
            f"{self.url}{self.project2.pk}/",
            {"name": "Hacked", "description": "Hack"}
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_delete_other_user_project(self):
        self.client.login(username="user1", password="1234")

        response = self.client.delete(f"{self.url}{self.project2.pk}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

