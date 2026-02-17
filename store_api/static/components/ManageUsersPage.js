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
                headers: { 'Content-Type': 'application/json' }
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
                    headers: { 'Content-Type': 'application/json' }
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
                <h1 className="manage-users-title">Manage Users</h1>
                
                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
                
                {loading ? (
                    <p className="loading-text">Loading users...</p>
                ) : users.length === 0 ? (
                    <p className="no-users-text">No users found</p>
                ) : (
                    <div className="users-table">
                        <div className="table-header">
                            <div>Username</div>
                            <div>Email</div>
                            <div>Role</div>
                            <div>Actions</div>
                        </div>
                        
                        {users.map(userItem => (
                            <div key={userItem.id} className="table-row">
                                <div>
                                    {userItem.username}
                                    {userItem.id === currentUser.id && (
                                        <span className="you-badge">(You)</span>
                                    )}
                                </div>
                                <div>{userItem.email || userItem.mail || 'No email'}</div>
                                <div>
                                    <span className={`role-badge ${userItem.admin ? 'admin' : 'user'}`}>
                                        {userItem.admin ? 'Admin' : 'User'}
                                    </span>
                                </div>
                                <div>
                                    {userItem.id !== currentUser.id && (
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(userItem.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="total-users">
                    <p>Total Users: {users.length}</p>
                </div>
            </div>
        </div>
    );
}