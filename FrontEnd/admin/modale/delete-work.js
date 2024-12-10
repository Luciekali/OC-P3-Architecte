export function getWorkId(event) {
    const workId = event.target.closest('button').value
    return workId
}

export async function deleteWorkRequest(workId) {
    const token = localStorage.getItem('token')
    await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
}


