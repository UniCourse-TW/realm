export const Role = {
	User: "User",
	Verified: "Verified",
	Moderator: "Moderator",
	CoursePacker: "CoursePacker",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];
