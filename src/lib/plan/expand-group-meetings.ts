import type { ExtendedGroup, GroupMeeting } from "@/types";

function legacyMeeting(group: ExtendedGroup): GroupMeeting {
  return {
    day: group.day,
    startTime: group.startTime,
    endTime: group.endTime,
    dates: group.dates ?? [],
  };
}

/** Expands one logical USOS group into the cards needed by schedule views. */
export function expandGroupMeetings(group: ExtendedGroup): ExtendedGroup[] {
  const meetings =
    group.meetings?.length == null ? [legacyMeeting(group)] : group.meetings;

  return meetings.map((meeting, index) => ({
    ...group,
    meetingKey: `${group.groupId}-${index.toString()}`,
    day: meeting.day,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
    dates: meeting.dates,
  }));
}

export function expandGroupsMeetings(groups: ExtendedGroup[]): ExtendedGroup[] {
  return groups.flatMap((element) => expandGroupMeetings(element));
}
