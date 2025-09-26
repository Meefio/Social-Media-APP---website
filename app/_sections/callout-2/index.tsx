import { fragmentOn } from "basehub";
import { Section } from "../../../common/section-wrapper";
import { TrackedButtonLink } from "../../../components/tracked-button";
import { buttonFragment } from "../../../lib/basehub/fragments";
import { GeneralEvents } from "../../../lib/basehub/fragments";

export const calloutv2Fragment = fragmentOn("CalloutV2Component", {
  title: true,
  subtitle: true,
  _analyticsKey: true,
  actions: {
    ...buttonFragment,
  },
});
type Callout2 = fragmentOn.infer<typeof calloutv2Fragment>;

export function Callout2(callout: Callout2 & { eventsKey: GeneralEvents["ingestKey"] }) {
  return (
    <Section>
      <article className="flex flex-col justify-center gap-6 self-stretch rounded-xl bg-[rgba(var(--accent-500),0.1)] p-6 dark:bg-[rgba(var(--accent-600),0.1)] lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:p-10">
        <div className="flex flex-col gap-3 max-w-[80%]">
          <h4 className="text-3xl font-medium text-[--text-primary] dark:text-[--dark-text-primary] lg:text-4xl">
            {callout.title}
          </h4>
          <p className="text-lg text-[--text-secondary] dark:text-[--dark-text-secondary] lg:text-xl">
            {callout.subtitle}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-sm lg:w-auto lg:flex-shrink-0">
          {callout.actions?.map((action) => (
            <TrackedButtonLink
              key={action._id}
              analyticsKey={callout.eventsKey}
              href={action.href}
              intent={action.type}
              name="secondary_cta_click"
              className="w-full lg:w-auto"
            >
              {action.label}
            </TrackedButtonLink>
          ))}
        </div>
      </article>
    </Section>
  );
}
