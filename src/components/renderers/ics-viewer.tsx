"use client";

import ICAL from "ical.js";
import { Calendar, MapPin, Repeat, User } from "lucide-react";
import { useMemo, useState } from "react";

interface IcsViewerProps {
  content: string;
}

interface ParsedEvent {
  summary: string;
  dtstart: Date | null;
  dtend: Date | null;
  location: string | null;
  description: string | null;
  recurrence: string | null;
  organizer: string | null;
}

function parseRecurrence(rrule: string): string {
  const parts = rrule.split(";").reduce(
    (acc, part) => {
      const [key, value] = part.split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  const freq = parts.FREQ?.toLowerCase();
  if (!freq) return rrule;

  const dayMap: Record<string, string> = {
    MO: "Monday",
    TU: "Tuesday",
    WE: "Wednesday",
    TH: "Thursday",
    FR: "Friday",
    SA: "Saturday",
    SU: "Sunday",
  };

  let text = freq.charAt(0).toUpperCase() + freq.slice(1);
  if (parts.BYDAY) {
    const days = parts.BYDAY.split(",")
      .map((d) => dayMap[d] ?? d)
      .join(", ");
    text += ` on ${days}`;
  }
  if (parts.BYMONTHDAY) {
    text += ` on day ${parts.BYMONTHDAY}`;
  }
  return text;
}

function parseEvents(content: string): ParsedEvent[] {
  try {
    const jcalData = ICAL.parse(content);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    return vevents.map((vevent) => {
      const event = new ICAL.Event(vevent);
      const rruleProp = vevent.getFirstPropertyValue("rrule");

      return {
        summary: event.summary || "Untitled Event",
        dtstart: event.startDate ? event.startDate.toJSDate() : null,
        dtend: event.endDate ? event.endDate.toJSDate() : null,
        location: event.location || null,
        description: event.description || null,
        recurrence: rruleProp ? parseRecurrence(rruleProp.toString()) : null,
        organizer: String(vevent.getFirstProperty("organizer")?.getParameter("cn") ?? "") || null,
      };
    });
  } catch {
    return [];
  }
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function formatDateRange(start: Date | null, end: Date | null): string {
  if (!start) return "No date specified";

  const datePart = dateFormatter.format(start);
  const startTime = timeFormatter.format(start);

  if (!end) return `${datePart} at ${startTime}`;

  const endTime = timeFormatter.format(end);
  return `${datePart}, ${startTime} - ${endTime}`;
}

const URL_REGEX = /https?:\/\/[^\s<>"')\]]+/g;

function Linkified({ text }: { text: string }) {
  const parts: (string | { url: string; index: number })[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push({ url: match[0], index: match.index });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <>
      {parts.map((part) =>
        typeof part === "string" ? (
          part
        ) : (
          <a
            key={part.index}
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-300 dark:decoration-neutral-700 hover:decoration-neutral-500 text-neutral-950 dark:text-neutral-50 transition-[text-decoration-color] duration-150"
          >
            {part.url}
          </a>
        ),
      )}
    </>
  );
}

function EventCard({ event }: { event: ParsedEvent }) {
  const [descExpanded, setDescExpanded] = useState(false);
  const descriptionTruncateLength = 200;
  const isLongDescription =
    event.description && event.description.length > descriptionTruncateLength;

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-3">
      <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
        {event.summary}
      </h3>

      <div className="mt-2 flex flex-col gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <Calendar size={13} className="shrink-0 text-neutral-400" />
          <span>{formatDateRange(event.dtstart, event.dtend)}</span>
        </div>

        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin size={13} className="shrink-0 text-neutral-400" />
            <span>{event.location}</span>
          </div>
        )}

        {event.recurrence && (
          <div className="flex items-center gap-2">
            <Repeat size={13} className="shrink-0 text-neutral-400" />
            <span>{event.recurrence}</span>
          </div>
        )}

        {event.organizer && (
          <div className="flex items-center gap-2">
            <User size={13} className="shrink-0 text-neutral-400" />
            <span>Organized by {event.organizer}</span>
          </div>
        )}
      </div>

      {event.description && (
        <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <p className="whitespace-pre-line">
            <Linkified
              text={
                isLongDescription && !descExpanded
                  ? event.description.slice(0, descriptionTruncateLength) + "..."
                  : event.description
              }
            />
          </p>
          {isLongDescription && (
            <button
              onClick={() => setDescExpanded(!descExpanded)}
              className="mt-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer transition-colors"
            >
              {descExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function IcsViewer({ content }: IcsViewerProps) {
  const events = useMemo(() => parseEvents(content), [content]);

  if (events.length === 0) {
    return (
      <p className="text-sm text-neutral-500">No events found</p>
    );
  }

  return (
    <div className="text-[13px]">
      <p className="text-xs text-neutral-500 mb-3 font-mono">
        {events.length} {events.length === 1 ? "event" : "events"}
      </p>
      <div className="flex flex-col gap-3">
        {events.map((event, i) => (
          <EventCard key={i} event={event} />
        ))}
      </div>
    </div>
  );
}
