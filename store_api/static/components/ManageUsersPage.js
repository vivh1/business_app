const { useState, useEffect } = React;

function ManageUsersPage({ onDeleteUser, currentUser }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/users/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users || []);
            } else {
                setMessage('Failed to load users');
            }
        } catch (error) {
            setMessage('Cannot connect to server to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/users/${userId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                if (response.ok) {
                    setUsers(users.filter(u => u.id !== userId));
                    setMessage('User deleted successfully');
                    setTimeout(() => setMessage(''), 3000);
                } else {
                    setMessage('Failed to delete user');
                }
            } catch (error) {
                setMessage('Cannot connect to server to delete user');
            }
        }
    };

    return (
        <div className="manage-users-page">
            <div className="manage-users-container">
                <h1 style={{ marginBottom: '2rem', color: '#333' }}>Manage Users</h1>
                
                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`} style={{ marginBottom: '1.5rem' }}>
                        {message}
                    </div>
                )}
                
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                        Loading users...
                    </p>
                ) : users.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                        No users found
                    </p>
                ) : (
                    <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr 1fr 100px',
                            padding: '1rem',
                            background: '#f8f9fa',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #e0e0e0'
                        }}>
                            <div>Username</div>
                            <div>Email</div>
                            <div>Role</div>
                            <div>Actions</div>
                        </div>
                        
                        {users.map((userItem) => (
                            <div key={userItem.id} style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr 1fr 100px',
                                padding: '1rem',
                                borderBottom: '1px solid #f0f0f0',
                                alignItems: 'center'
                            }}>
                                <div>
                                    {userItem.username}
                                    {userItem.id === currentUser.id && (
                                        <span style={{ 
                                            fontSize: '0.8rem', 
                                            color: '#667eea', 
                                            marginLeft: '0.5rem',
                                            fontWeight: '600'
                                        }}>
                                            (You)
                                        </span>
                                    )}
                                </div>
                                <div>{userItem.email || userItem.mail}</div>
                                <div>
                                    {userItem.admin ? (
                                        <span style={{ 
                                            background: '#667eea', 
                                            color: 'white', 
                                            padding: '0.25rem 0.75rem', 
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600'
                                        }}>
                                            Admin
                                        </span>
                                    ) : (
                                        <span style={{ 
                                            background: '#6c757d', 
                                            color: 'white', 
                                            padding: '0.25rem 0.75rem', 
                                            borderRadius: '20px',
                                            fontSize: '0.8rem'
                                        }}>
                                            User
                                        </span>
                                    )}
                                </div>
                                <div>
                                    {userItem.id !== currentUser.id && (
                                        <button 
                                            onClick={() => handleDelete(userItem.id)}
                                            style={{
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#c82333'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#dc3545'}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div style={{ marginTop: '2rem', color: '#666', fontSize: '0.9rem' }}>
                    <p>Total Users: {users.length}</p>
                </div>
            </div>
        </div>
    );
}