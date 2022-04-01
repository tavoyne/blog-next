import { format, parseISO } from "date-fns";

export default function Date({ dateString }: { dateString: string }) {
  const date = parseISO(dateString);
  return (
    <time className="gray" dateTime={dateString}>
      {format(date, "LLLL d, yyyy")}
    </time>
  );
}
