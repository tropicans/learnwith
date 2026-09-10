/**
 * Cross-tab Real-time Broadcast Synchronization for Course Lifecycle
 * Requirements: COURSE-SYNC-01, COURSE-SYNC-02, D-13, D-14
 */

export interface CourseStatusBroadcastMessage {
  type: 'STATUS_UPDATED'
  courseId: string
  targetStatus: string
  timestamp: number
}

export const COURSE_STATUS_BROADCAST_CHANNEL = 'learnwith:course_status_changed'

/**
 * Broadcast course lifecycle mutations to other active browser tabs.
 */
export function broadcastCourseStatusChange(courseId: string, targetStatus: string): void {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
    return
  }

  try {
    const channel = new BroadcastChannel(COURSE_STATUS_BROADCAST_CHANNEL)
    const message: CourseStatusBroadcastMessage = {
      type: 'STATUS_UPDATED',
      courseId,
      targetStatus,
      timestamp: Date.now(),
    }
    channel.postMessage(message)
    channel.close()
  } catch (err) {
    // Graceful degradation if BroadcastChannel is blocked by sandbox or security policy
    console.warn('[CourseBroadcast] Failed to broadcast course status change:', err)
  }
}