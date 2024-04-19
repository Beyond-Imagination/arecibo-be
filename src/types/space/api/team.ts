export interface Profile {
    id: string
    username: string
    name: {
        firstName: string
        lastName: string
    }
    smallAvatar: string
    avatar: string
    profilePicture: string
}

export interface Team {
    id: string
    name: string
    memberships: [Membership]
}

interface Membership {
    member: Member
}

interface Member {
    id: string
    username: string
}
