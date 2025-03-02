export const getRequest = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
export const postRequest = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
};

export const updatePostRequestUsingId = async (url) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const result = await response.json();
    return result;
};

export const deleteRequest = async (url) => {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const result = await response.json();
    return result;
};


export const searchProducts = async (query, limit, cursor = null) => {
    let url = `/api/search/products/${query}/${limit}`;
    if (cursor) url += `?cursor=${cursor}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
};

