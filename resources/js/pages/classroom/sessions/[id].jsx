import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import ClassroomHeader from './components/ClassroomHeader';
import ClassroomVideoStage from './components/ClassroomVideoStage';
import DesktopClassroomLayout from './components/DesktopClassroomLayout';
import StackedClassroomLayout from './components/StackedClassroomLayout';
import {
    buildPendingClassroomState,
    classroomBreakpoint,
} from './classroomHelpers';

function readBreakpoint() {
    if (typeof window === 'undefined') {
        return classroomBreakpoint.desktop;
    }

    if (window.matchMedia('(min-width: 1280px)').matches) {
        return classroomBreakpoint.desktop;
    }

    if (window.matchMedia('(min-width: 768px)').matches) {
        return classroomBreakpoint.tablet;
    }

    return classroomBreakpoint.mobile;
}

export default function ClassroomSession({
    data = {},
    classroom = {},
    jitsiAccess = null,
}) {
    const mappedClassroom = useMemo(
        () => buildPendingClassroomState(data, classroom),
        [data, classroom],
    );

    const jitsiApiRef = useRef(null);
    const jitsiMediaStateRef = useRef({
        isAudioMuted: mappedClassroom.currentParticipant?.is_muted,
        isScreenSharing: mappedClassroom.currentParticipant?.is_screen_sharing,
        isVideoMuted:
            mappedClassroom.currentParticipant?.is_camera_on === undefined
                ? undefined
                : !mappedClassroom.currentParticipant.is_camera_on,
    });
    const [breakpoint, setBreakpoint] = useState(readBreakpoint);
    const [isJoined, setIsJoined] = useState(false);
    const [currentParticipant, setCurrentParticipant] = useState(
        mappedClassroom.currentParticipant,
    );
    const [participants, setParticipants] = useState(
        mappedClassroom.participants,
    );
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [chatFilterParticipant, setChatFilterParticipant] = useState(null);
    const [activeMobilePanel, setActiveMobilePanel] = useState('chat');
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [activeFocusOverlay, setActiveFocusOverlay] = useState(null);

    const canShareScreen = Boolean(jitsiAccess?.can_share_screen);

    useEffect(() => {
        setCurrentParticipant(
            mappedClassroom.currentParticipant
                ? {
                      ...mappedClassroom.currentParticipant,
                      can_share_screen: canShareScreen,
                  }
                : mappedClassroom.currentParticipant,
        );
        setParticipants(
            mappedClassroom.participants.map((participant) =>
                participant.id === mappedClassroom.currentParticipant?.id
                    ? { ...participant, can_share_screen: canShareScreen }
                    : participant,
            ),
        );
    }, [
        canShareScreen,
        mappedClassroom.currentParticipant,
        mappedClassroom.participants,
    ]);

    useEffect(() => {
        const handleResize = () => setBreakpoint(readBreakpoint());

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDesktop = breakpoint === classroomBreakpoint.desktop;
    const isTablet = breakpoint === classroomBreakpoint.tablet;
    const isMobile = breakpoint === classroomBreakpoint.mobile;
    const showNativeRecordingControl = Boolean(
        isJoined && jitsiAccess?.can_record && !isMobile,
    );

    const attendanceStatus = {
        is_joined: isJoined,
        joined_at: isJoined ? new Date().toISOString() : null,
    };

    const handleJoin = () => {
        setIsJoined(true);
    };

    const handleLeave = () => {
        setIsJoined(false);
        setIsFocusMode(false);
        setActiveFocusOverlay(null);
    };

    const executeJitsiCommand = useCallback((command) => {
        try {
            jitsiApiRef.current?.executeCommand?.(command);
        } catch {
            // Jitsi commands are local best-effort in Phase 1.
        }
    }, []);

    const syncJitsiScreenShareState = useCallback(
        (payload) => {
            if (!Object.hasOwn(payload, 'is_screen_sharing')) {
                return true;
            }

            if (!isJoined || !jitsiApiRef.current || !canShareScreen) {
                return false;
            }

            const desiredScreenSharing = Boolean(payload.is_screen_sharing);
            const currentScreenSharing =
                jitsiMediaStateRef.current.isScreenSharing;

            if (
                currentScreenSharing === undefined ||
                currentScreenSharing !== desiredScreenSharing
            ) {
                executeJitsiCommand('toggleShareScreen');
            }

            jitsiMediaStateRef.current = {
                ...jitsiMediaStateRef.current,
                isScreenSharing: desiredScreenSharing,
            };

            return true;
        },
        [canShareScreen, executeJitsiCommand, isJoined],
    );

    const handleUpdateParticipant = (payload) => {
        if (Object.hasOwn(payload, 'is_muted')) {
            executeJitsiCommand('toggleAudio');
        }

        if (Object.hasOwn(payload, 'is_camera_on')) {
            executeJitsiCommand('toggleVideo');
        }

        if (Object.hasOwn(payload, 'is_screen_sharing')) {
            if (!syncJitsiScreenShareState(payload)) {
                return;
            }
        }

        setCurrentParticipant((current) =>
            current ? { ...current, ...payload } : current,
        );
        setParticipants((items) =>
            items.map((participant) =>
                participant.id === currentParticipant?.id
                    ? { ...participant, ...payload }
                    : participant,
            ),
        );
    };

    const handleJitsiMediaStateChange = useCallback((state) => {
        const payload = {};

        if (Object.hasOwn(state, 'isAudioMuted')) {
            payload.is_muted = Boolean(state.isAudioMuted);
        }

        if (Object.hasOwn(state, 'isVideoMuted')) {
            payload.is_camera_on = !state.isVideoMuted;
        }

        if (Object.hasOwn(state, 'isScreenSharing')) {
            payload.is_screen_sharing = Boolean(state.isScreenSharing);
        }

        if (!Object.keys(payload).length) {
            return;
        }

        jitsiMediaStateRef.current = {
            ...jitsiMediaStateRef.current,
            ...state,
        };

        setCurrentParticipant((current) =>
            current ? { ...current, ...payload } : current,
        );
        setParticipants((items) =>
            items.map((participant) =>
                participant.id === currentParticipant?.id
                    ? { ...participant, ...payload }
                    : participant,
            ),
        );
    }, [currentParticipant?.id]);

    const handleToggleMobilePanel = (panel) => {
        setActiveMobilePanel((value) => (value === panel ? null : panel));
    };

    const revealFocusControls = () => undefined;
    const disabledAction = () => null;

    const videoStage = (
        <ClassroomVideoStage
            isDesktop={isDesktop}
            isFocusMode={isFocusMode}
            session={mappedClassroom.session}
            jitsiAccess={jitsiAccess}
            currentParticipant={currentParticipant}
            currentUser={mappedClassroom.currentUser}
            participants={participants}
            isJoined={isJoined}
            permissions={{
                ...mappedClassroom.permissions,
                can_share_screen: canShareScreen,
            }}
            canJoin={mappedClassroom.permissions.can_join}
            isJoining={false}
            onJoin={handleJoin}
            onJitsiApiReady={(api) => {
                jitsiApiRef.current = api;
            }}
            onJitsiApiDisposed={() => {
                jitsiApiRef.current = null;
                jitsiMediaStateRef.current = {
                    isAudioMuted: currentParticipant?.is_muted,
                    isScreenSharing: currentParticipant?.is_screen_sharing,
                    isVideoMuted:
                        currentParticipant?.is_camera_on === undefined
                            ? undefined
                            : !currentParticipant.is_camera_on,
                };
            }}
            onJitsiMediaStateChange={handleJitsiMediaStateChange}
            isParticipantUpdating={false}
            isLeaving={false}
            areFocusControlsVisible
            isJoinedHostWithNativeRecordingControl={
                showNativeRecordingControl
            }
            onUpdateParticipant={handleUpdateParticipant}
            onToggleFocusMode={() => setIsFocusMode((value) => !value)}
            revealFocusControls={revealFocusControls}
            onLeave={handleLeave}
            activeFocusOverlay={activeFocusOverlay}
            setActiveFocusOverlay={setActiveFocusOverlay}
            messages={mappedClassroom.messages}
            isSendingMessage={false}
            onSendMessage={disabledAction}
            chatFilterParticipant={chatFilterParticipant}
            setChatFilterParticipant={setChatFilterParticipant}
            onEditMessage={disabledAction}
            onDeleteMessage={disabledAction}
            isModeratingParticipant={false}
            onModerateParticipant={disabledAction}
        />
    );

    return (
        <>
            <Head title={mappedClassroom.session.title} />

            <div className="min-h-screen bg-background text-foreground">
                {!isFocusMode && (
                    <ClassroomHeader
                        session={mappedClassroom.session}
                        currentUser={mappedClassroom.currentUser}
                        attendanceStatus={attendanceStatus}
                    />
                )}

                <div className="mx-4 mt-4 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200 md:mx-6">
                    {mappedClassroom.pendingMessage}
                </div>

                <div
                    className={cn(
                        'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto',
                        isFocusMode
                            ? 'p-3 md:p-4'
                            : cn(
                                  'p-4 md:p-6',
                                  isMobile && 'pb-24',
                                  isDesktop &&
                                      'grid grid-cols-[minmax(0,1fr)_320px] grid-rows-[minmax(0,1fr)] overflow-hidden',
                              ),
                    )}
                >
                    {!isFocusMode && isDesktop ? (
                        <DesktopClassroomLayout
                            videoStage={videoStage}
                            resources={mappedClassroom.resources}
                            messages={mappedClassroom.messages}
                            currentUser={mappedClassroom.currentUser}
                            permissions={mappedClassroom.permissions}
                            participants={participants}
                            selectedParticipant={selectedParticipant}
                            onSelectParticipant={setSelectedParticipant}
                            isUploadingResource={false}
                            isDeletingResource={false}
                            onUploadResource={disabledAction}
                            onDeleteResource={disabledAction}
                            isSendingMessage={false}
                            onSendMessage={disabledAction}
                            isModeratingParticipant={false}
                            onModerateParticipant={disabledAction}
                        />
                    ) : !isFocusMode ? (
                        <StackedClassroomLayout
                            videoStage={videoStage}
                            isTablet={isTablet}
                            isMobile={isMobile}
                            activeMobilePanel={activeMobilePanel}
                            onToggleMobilePanel={handleToggleMobilePanel}
                            resources={mappedClassroom.resources}
                            messages={mappedClassroom.messages}
                            currentUser={mappedClassroom.currentUser}
                            permissions={mappedClassroom.permissions}
                            participants={participants}
                            isUploadingResource={false}
                            isDeletingResource={false}
                            onUploadResource={disabledAction}
                            onDeleteResource={disabledAction}
                            isSendingMessage={false}
                            onSendMessage={disabledAction}
                            isModeratingParticipant={false}
                            onModerateParticipant={disabledAction}
                        />
                    ) : (
                        <div
                            className={cn(
                                'flex min-w-0 flex-1 flex-col gap-4',
                                isDesktop && 'h-full min-h-0',
                            )}
                        >
                            {videoStage}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
