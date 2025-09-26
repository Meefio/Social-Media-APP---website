import { BaseHubImage } from "basehub/next-image";
import clsx from "clsx";

import { Section } from "../../../common/section-wrapper";
import { fragmentOn } from "basehub";

import s from "./companies.module.css";

export const companiesFragment = fragmentOn("CompaniesComponent", {
  subtitle: true,
  companies: {
    _title: true,
    url: true,
    image: {
      url: true,
    },
  },
});

type Companies = fragmentOn.infer<typeof companiesFragment>;

export function Companies(props: Companies) {
  const companyCaptions = [
    "Facebook",
    "Instagram", 
    "Google Business",
    "X (Twitter)",
    "LinkedIn"
  ];

  return (
    <Section container="full">
      <h2 className="text-xl text-center tracking-tight text-white">
        {props.subtitle}
      </h2>
      <div className="no-scrollbar flex max-w-full justify-center overflow-auto">
        <div className="bg-linear-to-r from-surface-primary dark:from-dark-surface-primary pointer-events-none absolute left-0 top-0 h-full w-[30vw] bg-transparent xl:hidden" />
        <div className="bg-linear-to-l from-surface-primary dark:from-dark-surface-primary pointer-events-none absolute right-0 top-0 h-full w-[30vw] bg-transparent xl:hidden" />
        <div
          className={clsx("flex shrink-0 items-center gap-3 px-4 lg:gap-6 lg:px-12", s.scrollbar)}
        >
          {props.companies.map((company, index) => (
            <figure
              key={company.image?.url ?? company._title}
              className="flex flex-col items-center px-1 py-2 lg:p-4"
            >
              <BaseHubImage
                alt={company._title}
                className="object-contain"
                height={40}
                src={company.image!.url}
                width={40}
              />
              <figcaption className="mt-2 text-xs md:text-sm text-center text-white/80">
                {companyCaptions[index] || company._title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Section>
  );
}
