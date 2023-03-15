from django.db import models

class Persona(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email = models.EmailField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.nombre} {self.apellido}"