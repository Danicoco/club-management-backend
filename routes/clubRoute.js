const express = require('express');
const { createClub, deleteClub,
    inviteMembers, removeMember, acceptInvitation,
    rejectInvitation, allClubs, allMembers, clubMembers
} = require('../controller/clubController');
const isAuthenticated = require('../config/middleware');
const clubRoute = express.Router();

//define routes
clubRoute.post('/', isAuthenticated, createClub);
clubRoute.get('/', isAuthenticated, allClubs);
clubRoute.get('/members', isAuthenticated, allMembers);
clubRoute.get('/my-members/:id', isAuthenticated, clubMembers);
clubRoute.delete('/delete-club/:club_id', isAuthenticated, deleteClub);
clubRoute.get('/members/invite/:username/:clubId', isAuthenticated, inviteMembers);
clubRoute.delete('/members/remove/:clubmember_id', isAuthenticated, removeMember);
clubRoute.get('/members/accept/:clubmember_id', isAuthenticated, acceptInvitation);
clubRoute.get('/members/reject/:clubmember_id', isAuthenticated, rejectInvitation);

module.exports = clubRoute;