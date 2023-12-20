import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user, updateUserProfile, updatePassword } = useAuth();
    const [editing, setEditing] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newDateOfBirth, setNewDateOfBirth] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleEditing = () => {
        setEditing(true)
    }

    const handleEditingPassword = () => {
        setEditingPassword(true)
    }

    const handleUpdateProfile = () => {
        if (newFirstName && newLastName && newEmail && newDateOfBirth) {
        updateUserProfile(
            user.userData.UserID,
            newEmail,
            user.userData.Password,
            newFirstName,
            newLastName,
            newDateOfBirth
        );
        setEditing(false)
        } else {
        console.error('Veuillez remplir toutes les informations de mise à jour du profil.');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        try {
        if (currentPassword && newPassword) {
            await updatePassword(user.userData.UserID, currentPassword, newPassword);
            setCurrentPassword('');
            setNewPassword('');
        } else {
            console.error('Veuillez remplir tous les champs du formulaire de changement de mot de passe.');
        }
        setEditingPassword(false)
        } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe:', error.message);
        }
    };


    const formatBirthDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('fr-FR', options);
        return formattedDate;
    };

    return (
        <section className="dashboard">
            <div className="content">
                <div className="card__profile">
                    <h2>Vos informations personnelles</h2>
                    {!editing ? (
                        <div className="card__body">
                            <div className="line__group__profile">
                                <h3>Votre prénom et nom</h3>
                                <p className="user">{user.userData.FirstName}, {user.userData.LastName}</p>
                            </div>
                            <div className="line__group__profile">
                                <h3>Votre Email</h3>
                                <p>{user.userData.Email}</p>
                            </div>
                            <div className="line__group__profile">
                                <h3>Date de naissance</h3>
                                <p>{formatBirthDate(user.userData.DateOfBirth)}</p>
                            </div>
                            <button type="button" className="button__profile" onClick={handleEditing}>
                                Modifier
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="card__body">
                            <div className="input__group">
                                <label>Modifier prénom :</label>
                                <input
                                type="text"
                                placeholder="Nouveau prénom"
                                value={newFirstName}
                                onChange={(e) => setNewFirstName(e.target.value)}
                                />
                            </div>
                            <div className="input__group">
                                <label>Modifier nom de famille :</label>
                                <input
                                type="text"
                                placeholder="Nouveau nom de famille"
                                value={newLastName}
                                onChange={(e) => setNewLastName(e.target.value)}
                                />
                            </div>
                            <div className="input__group">
                                <label>Modifier Email :</label>
                                <input
                                type="text"
                                placeholder="Nouvel email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                />
                            </div>
                            <div className="input__group">
                                <label>Modifier date de naissance :</label>
                                <input
                                type="date"
                                placeholder="Nouvelle date de naissance"
                                value={newDateOfBirth}
                                onChange={(e) => setNewDateOfBirth(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="button__profile_alt">Mettre à jour le profil</button>
                        </form>
                    )}
                    {!editingPassword ? (
                        <div className="card__body">
                            <div className="line__group__profile">
                                <h3>Mon mot de passe</h3>
                                <p>**********</p>
                            </div>

                            <button type="button" className="button__profile" onClick={handleEditingPassword}>
                                Changer mon mot de passe
                            </button>
                        </div>
                    
                    ) : (
                        <form onSubmit={handleChangePassword} className="card__body">
                            <h3>Changer le mot de passe</h3>
                            <div className="input__group">
                                <label>Mot de passe actuel :</label>
                                <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="input__group">
                                <label>Nouveau mot de passe :</label>
                                <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="button__profile_alt">
                                Changer le mot de passe
                            </button>
                        </form>
                    )}

                </div>         
            </div>  
        </section>
    );
};

export default Dashboard;
