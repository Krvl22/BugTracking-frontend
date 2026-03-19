// services/userService.js
import API from '../api/axios';

export const getAllUsers    = ()          => API.get('/users');
export const updateUser    = (id, data)  => API.put(`/users/${id}`, data);
export const deleteUser    = (id)        => API.delete(`/users/${id}`);
export const blockUser     = (id)        => API.patch(`/users/${id}/block`);
export const reactivateUser = (id)       => API.patch(`/users/${id}/reactivate`);