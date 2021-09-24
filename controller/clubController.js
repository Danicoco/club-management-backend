const e = require('express');
const { Club, ClubMember, User } = require('../models');

//create club
//An admin must have a unique club name
const createClub = async(req, res) => {
    const { name, description } = req.body;
    const { id } = req.user;
    try {
        //find if this user already have a club with the same name
        const club = await Club.findOne({
            where: {
                UserId: id,
                name: name
            }
        });

        if(club)
            return res.status(400).json({
                status: 400,
                message: `You already have a club named ${name}`
            });
        
        //if club does not exist, create one
        const new_club = await Club.create({
            name, description, UserId: id
        });
        await new_club.save();

        return res.status(200).json({
            status: 200,
            message: `You've successfully created ${new_club.name}`
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}
//delete club
const deleteClub = async(req, res) => {
    const { club_id } = req.params;
    const { id } = req.user;
    try {
        //check if record exist in db
        const club = await Club.findOne({
            where: {
                id: club_id,
                UserId: id
            }
        });

        console.log(club);
        if(!club || club === null)
            return res.status(400).json({
                status: 400,
                message: "Cannot delete invalid club"
            });
    
        //if club exist, delete it
        await Club.destroy({
            where: {
                id: club.id
            }
        });
        
        //return success message
        return res.status(200).json({
            status: 200,
            message: `${club.name} was successfully deleted`
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

const allClubs = async(req, res) => {
    const { id } = req.user;
    try {
        const club = await Club.findAll({
            where: {
                UserId: id
            }
        });
        return res.status(200).json(club);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

const allMembers = async(req, res) => {
    const { id } = req.user;
    try {
        const user = await User.findAll({
            attributes: {
                exclude: ['password']
            },
            order: [['id', 'DESC']]
        });

        return res.status(200).json({
            status: 200,
            message: "Member's list",
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}


const clubMembers = async(req, res) => {
    const { id } = req.params;
    try {
        const members = await ClubMember.findAll({
            where: {
                ClubId: id
            }
        });
        
        return res.status(200).json({
            status: 200,
            message: "Member's list",
            data: members
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}

//add members
const inviteMembers = async(req, res) => {
    const { username, clubId } = req.params;
    const { id } = req.user;
    try {
        //check if user is already a member of this club    
        const club = await Club.findOne({
            where: {
                id: clubId
            }
        });

        if(!club || club === null)
            return res.status(400).json({
                status: 400,
                message: "Cannot invite member to invalid club"
            });
        
        //check if member is a valid user on the platform
        const user = await User.findOne({
            where: {
                username: username
            }
        });
        if(!user || user === null)
            return res.status(400).json({
                status: 400,
                message: "Cannot invite unknown user"
            });
        
        //check if member already exist in the club
        const club_member = await ClubMember.findOne({
            where: {
                username: username
            }
        });

        if(club_member)
            return res.status(400).json({
                status: 400,
                message: `${username} is already a member of your club`
            });

        //if all check passed, invite member
        const club_invitee = await ClubMember.create({ 
            username: username,
            full_name: `${user.first_name} ${user.last_name}`,
            ClubId: club.id,
            UserId: user.id
         });
         await club_invitee.save();

         //return success message
         return res.status(200).json({
             status: 200,
             message: `You invited ${user.first_name} ${user.last_name} to join your club`,
             data: club_invitee
         });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

//accept invite & add to db
const acceptInvitation = async(req, res) => {
    const { clubmember_id } = req.params;
    try {
        //check if club request is valid
        const club_member = await ClubMember.findOne({
            where: {
                id: clubmember_id
            }
        });
        if(!club_member || club_member === null)
            return res.status(400).json({
                status: 400,
                message: "There was an error processing your request"
            });
        
        //find club
        const club = await Club.findOne({
            where: {
                id: club_member.ClubId
            }
        });

        //update club member if valid
        await ClubMember.update({ status: 'active' }, {
            where: {
                id: club_member.id
            }
        });

        //return success message
        return res.status(200).json({
            status: 200,
            message: `You're now a member of ${club.name}`,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

//reject invitation
const rejectInvitation = async(req, res) => {
    const { clubmember_id } = req.params;
    try {
        //check if club request is valid
        const club_member = await ClubMember.findOne({
            where: {
                id: clubmember_id
            }
        });
        if(!club_member || club_member === null)
            return res.status(400).json({
                status: 400,
                message: "There was an error processing your request"
            });
        
        //find club
        const club = await Club.findOne({
            where: {
                id: club_member.ClubId
            }
        });

        //update club member if valid
        await ClubMember.update({ status: 'rejected' }, {
            where: {
                id: club_member.id
            }
        });

        //return success message
        return res.status(200).json({
            status: 200,
            message: `You're now a member of ${club.name}`,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

//remove members
const removeMember = async(req, res) => {
    const { clubmember_id } = req.params;
    try {
        //check if club request is valid
        const club_member = await ClubMember.findOne({
            where: {
                id: clubmember_id
            }
        });
        if(!club_member || club_member === null)
            return res.status(400).json({
                status: 400,
                message: "There was an error processing your request"
            });

        console.dir(club_member.ClubId);
        const club = await Club.findOne({
            where: {
                id: club_member.ClubId
            }
        });

        //delete member
        await ClubMember.destroy({
            where: {
                id: club_member.id
            }
        });

        console.log('successfull')
        //return success message
        return res.status(200).json({
            status: 200,
            message: `User deleted`,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    createClub,
    clubMembers,
    deleteClub,
    inviteMembers,
    acceptInvitation,
    rejectInvitation,
    removeMember,
    allClubs,
    allMembers
}