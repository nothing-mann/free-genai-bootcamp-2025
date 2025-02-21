from setuptools import setup, find_packages

setup(
    name="lang-portal",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        'flask',
        'flask-sqlalchemy',
        'flask-migrate',
        'flask-cors',
    ],
    python_requires=">=3.8",
)
