const API_BASE_URL = 'http://localhost:5186/api'; // Cambia esto si usas HTTPS (ej. https://localhost:7239/api)

export async function fetchClient(endpoint: string, options: RequestInit = {}) {
    const token = sessionStorage.getItem("authTokenJWT");

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = 'Error en la petición';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
    }

    // Para respuestas 204 No Content
    if (response.status === 204) {
        return null;
    }

    return await response.json();
}
