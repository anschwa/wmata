import { BusIcon, WarningIcon } from "./Icons";

type BusIncidentProps = {
  incidentType: string;
  routesAffected: string[];
  description: string;
  updatedAt: Date;
};

export default function BusIncident(props: BusIncidentProps) {
  const updatedAt = props.updatedAt.toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div className="mt-4 flex gap-2">
      <div className="flex-none">
        <WarningIcon />
      </div>
      <div className="flex-1 text-sm">
        <div className="mt-2 inline-flex">
          <BusIcon width={22} height={22} />
          <span className="ml-1">{props.routesAffected.join(", ")}</span>
        </div>
        <div className="text-sm text-left">{props.description}</div>
        <div className="text-sm text-right">{updatedAt}</div>
      </div>
    </div>
  );
}
