import { forwardRef, type ComponentPropsWithoutRef } from "react";

const BUSINESS_EMAIL = "aultman@gulfcoastdigitaldesign.com";

type EmailLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  email?: string;
};

/** A native email link works without JavaScript and supports copy-link actions. */
export const EmailLink = forwardRef<HTMLAnchorElement, EmailLinkProps>(
  ({ children, email = BUSINESS_EMAIL, onClick, ...props }, ref) => (
    <a
      ref={ref}
      {...props}
      href={`mailto:${email}`}
      onClick={onClick}
    >
      {children}
    </a>
  ),
);

EmailLink.displayName = "EmailLink";
