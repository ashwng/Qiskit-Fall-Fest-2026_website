import { Barcode } from "@/components/ui/Barcode";
import { event } from "@/data/event";
import type { RegistrationFormData } from "@/types";
import styles from "./AttendeePass.module.css";

interface AttendeePassProps {
  ticketId: string;
  attendee: Pick<
    RegistrationFormData,
    "fullName" | "institution" | "attendanceMode"
  >;
}

export function AttendeePass({ ticketId, attendee }: AttendeePassProps) {
  return (
    <div id="printable-pass-wrapper" className={styles.wrapper}>
      <article id="printable-pass" className={styles.pass} aria-label="QFF 2026 attendee pass">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>QFF 2026 / Attendee Pass</p>
            <h2 className={styles.title}>{event.fullName}</h2>
          </div>
          <span className={styles.status}>Confirmed</span>
        </div>

        <dl className={styles.eventDetails}>
          <div>
            <dt>Event dates</dt>
            <dd>{event.dates}</dd>
          </div>
          <div>
            <dt>Venue</dt>
            <dd>{event.venueName}</dd>
          </div>
        </dl>

        <dl className={styles.attendeeDetails}>
          <div className={styles.fullWidth}>
            <dt>Attendee name</dt>
            <dd className={styles.attendeeName}>{attendee.fullName}</dd>
          </div>
          <div className={styles.fullWidth}>
            <dt>Institution / University</dt>
            <dd>{attendee.institution}</dd>
          </div>
          <div className={styles.fullWidth}>
            <dt>Attendance</dt>
            <dd>{attendee.attendanceMode === "offline" ? "In person" : "Online"}</dd>
          </div>
        </dl>

        <section className={styles.entry} aria-labelledby="post-registration-heading">
          <h3 id="post-registration-heading">Campus entry requirements</h3>
          <ul>
            <li>
              Your QFF code <strong>{ticketId}</strong> permits campus entry for
              all 5 days ({event.dates}). Entry will be checked at the gate
              every time throughout this period.
            </li>
            <li>
              Carry <strong>both a government-issued ID card and an
              institute-issued ID card</strong> for campus entry.
            </li>
          </ul>
        </section>

        <div className={styles.barcodeSection}>
          <p className={styles.eyebrow}>Your QFF entry code</p>
          <Barcode value={ticketId} className={styles.barcode} height={64} />
          <p className={styles.barcodeHint}>Keep this pass ready for entry verification.</p>
        </div>
      </article>
    </div>
  );
}
