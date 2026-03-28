"use client";

import type { Prisma } from "@prisma/client";

import { Collapsible } from "@/components/Collapsible";
import { FactJson } from "@/components/FactJson";

type Json = Prisma.JsonValue;

export function ProfileCollapsibleSections({
  geography,
  economy,
  government,
  peopleAndSociety,
  military,
  energy,
}: {
  geography: Json | null | undefined;
  economy: Json | null | undefined;
  government: Json | null | undefined;
  peopleAndSociety: Json | null | undefined;
  military: Json | null | undefined;
  energy: Json | null | undefined;
}) {
  return (
    <>
      {geography ? (
        <Collapsible id="geography" title="Geography" defaultOpen={false}>
          <FactJson value={geography} />
        </Collapsible>
      ) : null}

      {economy ? (
        <Collapsible id="economy" title="Economy" defaultOpen={false}>
          <FactJson value={economy} />
        </Collapsible>
      ) : null}

      {government ? (
        <Collapsible id="government" title="Government" defaultOpen={false}>
          <FactJson value={government} />
        </Collapsible>
      ) : null}

      {peopleAndSociety ? (
        <Collapsible id="people" title="People & Society" defaultOpen={false}>
          <FactJson value={peopleAndSociety} />
        </Collapsible>
      ) : null}

      {military ? (
        <Collapsible id="military" title="Military" defaultOpen={false}>
          <FactJson value={military} />
        </Collapsible>
      ) : null}

      {energy ? (
        <Collapsible id="energy" title="Energy" defaultOpen={false}>
          <FactJson value={energy} />
        </Collapsible>
      ) : null}
    </>
  );
}
