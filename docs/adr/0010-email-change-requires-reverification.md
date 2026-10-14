# Email change takes effect only after re-verification

Changing the sign-in email (`user.updateEmail`, spec #81, `user-settings`
service) writes the new address immediately but clears `emailVerified`,
so the account reads as unverified until the new address is verified. A
changed email is therefore not effective immediately: credential sign-in
keeps working, but the verified flag stays null and the Email card
prompts for verification. OAuth-only accounts (no credential password)
cannot change the email until they set one — the address is the provider
identity and stays fixed, and resubmissions always reset the flag (no
same-address no-op).

## Considered Options

- **Immediate swap, keep the old verified flag**: treat the new address
  as verified because the account was verified before. Rejected — the
  flag would then vouch for an address the learner may not own, so a
  typo (or a hostile change) silently captures the account's contact
  point with no recovery signal.
- **Immediate swap plus a notice, no flag reset**: update the address
  and only tell the learner to verify. Rejected — without the null flag
  there is no durable state distinguishing "verified" from "claimed",
  so every downstream consumer (session payload, admin views) would
  keep trusting an unproven address.
- **Two-address pending flow (keep the old address until the new one
  verifies)**: store the new address as pending and only swap on
  confirmation. Rejected — it needs a pending column plus token
  plumbing the credentials surface does not have yet; the reset-flag
  flow is one column write with the same safety property (unverified
  until proven).

## Consequences

- `updateEmail` normalizes (trim + lowercase), requires a credential
  password (`BAD_REQUEST` for OAuth-only accounts), rejects taken
  addresses as CONFLICT, and persists `{ email, emailVerified: null }`
  in a single repository write (`user.updateEmail`). The unified
  `settingsOutputSchema` carries the null `emailVerified` so the Email
  card renders its Verified/Unverified badge without a redundant flag
  field.
- Trade-off accepted: a learner who mistypes the new address is locked
  into the unverified state until they correct it — there is no
  automatic revert to the old address, and resubmitting even the same
  address resets the flag. The Email card's verify prompt is the
  recovery path.
- If a pending-address flow is ever proposed, this record is the
  baseline it must beat: same safety (never flag an unproven address)
  with a smoother typo recovery.
