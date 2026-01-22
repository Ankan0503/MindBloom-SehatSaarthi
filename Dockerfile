# 1. Use a stable Python slim base
FROM python:3.11-slim

# 2. Set environment variables to optimize Python performance
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Install GDAL system dependencies
# These are necessary for the Python GDAL package to compile correctly
RUN apt-get update && apt-get install -y \
    binutils \
    libproj-dev \
    gdal-bin \
    libgdal-dev \
    python3-gdal \
    gcc \
    g++ \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# 4. Set CPLUS_INCLUDE_PATH so the compiler can find GDAL headers
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# 5. Set the working directory
WORKDIR /app

# 6. Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 7. Copy the project files
COPY . .

# 8. Collect all static files into the STATIC_ROOT folder
RUN python manage.py collectstatic --noinput

# 10. Expose port 8080 and run the server
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "dj_backend.wsgi:application"]