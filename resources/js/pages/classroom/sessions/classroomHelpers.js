export const classroomBreakpoint = {
    desktop: 'desktop',
    tablet: 'tablet',
    mobile: 'mobile',
};

export function buildClassroomSession(data = {}, classroom = {}) {
    const className = [data.type, data.class].filter(Boolean).join(' ');

    return {
        id: data.id,
        title: className || 'Classroom session',
        description: `Promo ${data.promo ?? '-'} - ${classroom.message ?? 'Backend connection pending'}`,
        status: classroom.status ?? 'pending',
        promo: data.promo,
        class: data.class,
        type: data.type,
    };
}

export function buildClassroomParticipants(data = {}) {
    const hostName = data.coach ?? 'Coach pending';
    const host = {
        id: `host-${data.id ?? 'class'}`,
        role: 'host',
        is_online: true,
        is_muted: false,
        is_camera_on: false,
        hand_raised: false,
        is_screen_sharing: false,
        can_share_screen: false,
        user: {
            id: `host-${data.id ?? 'class'}`,
            name: hostName,
            role: 'host',
        },
    };

    const students = (data.students ?? []).map((student) => ({
        id: `student-${student.id}`,
        role: 'student',
        is_online: false,
        is_muted: true,
        is_camera_on: false,
        hand_raised: false,
        is_screen_sharing: false,
        can_share_screen: false,
        user: {
            id: student.id,
            name: student.name,
            avatar: student.avatar,
            email: student.email,
            role: 'student',
        },
    }));

    return [host, ...students];
}

export function buildPendingClassroomState(data = {}, classroom = {}) {
    const participants = buildClassroomParticipants(data);
    const currentParticipant = participants[0] ?? null;

    return {
        session: buildClassroomSession(data, classroom),
        currentUser: currentParticipant?.user ?? {
            id: 'guest',
            name: 'Guest',
            role: 'guest',
        },
        currentParticipant,
        participants,
        messages: [],
        resources: [],
        attendanceStatus: {
            is_joined: false,
            joined_at: null,
        },
        permissions: {
            can_join: true,
            can_send_message: false,
            can_upload_resource: false,
            can_moderate_participants: false,
            can_share_screen: false,
            can_manage_recordings: false,
        },
        pendingMessage: classroom.message ?? 'Backend connection pending',
    };
}
