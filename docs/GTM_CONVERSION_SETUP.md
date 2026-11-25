# GTM setup: the two new Google Ads conversions

Do this in Google Tag Manager, container **GTM-K4QK6SP**, once Bretton has created the two conversion actions in Google Ads and given you their labels. Nothing in the website needs to change: the page already sends everything these tags read. Written 24 Nov 2026 against container version 13.

## What you need first

| Item | Value |
| --- | --- |
| Conversion ID (both tags) | `785313466` (already in the existing tags; do not change it) |
| Form conversion label | from Bretton: the part after the slash in `AW-785313466/<label>` |
| Phone conversion label | from Bretton, same format |
| Value and currency | `200` and `CAD` |
| Primary or Secondary | **Decided first** (see "Before you publish") |

Never put a new label into an existing tag, and never reuse these three, which belong to the live conversions: `a619COGS6LcYELrdu_YC` (form), `ZX2WCMKbjtYcELrdu_YC` (call), `vL_HCOeS6LcYELrdu_YC` (email).

## Before you publish: Primary or Secondary

The new form action overlaps the existing form action, and the new phone action overlaps the existing call action. If both of a pair are **Primary**, one lead or one call is counted twice and bidding sees inflated conversions. In Google Ads (Goals → Conversions → open the action → Edit settings → Action optimization), set the two new actions to **Secondary**, or the old ones, until you decide which pair to keep.

## Step 1: add a variable for the transaction id

1. In GTM: **Variables → User-Defined Variables → New**.
2. Name: `DLV - transaction_id`.
3. Variable type: **Data Layer Variable**. Data Layer Variable Name: `transaction_id`. Data Layer Version: **Version 2**.
4. Save.

The page puts the form's submission id in `transaction_id` on every `kosick_contact_lead` event. It is unique to each successful lead and does not change if the visitor has to retry.

## Step 2: new form conversion tag (clone the existing one)

1. **Tags**: open the Google Ads Conversion Tracking tag whose **Conversion Label** starts `a619COGS…`.
2. Use the tag's **⋮ menu → Duplicate**. Open the copy.
3. Rename it: `Google Ads - Conversion - Lead form (CAD 200)`.
4. **Conversion Label**: paste the new form label. Leave **Conversion ID** as it is.
5. **Conversion Value**: `200`. **Currency Code**: `CAD`.
6. **Transaction ID**: choose `{{DLV - transaction_id}}`.
7. Leave the Enhanced Conversions (user-provided data) setting and the trigger exactly as copied: the trigger is the Custom Event for `kosick_contact_lead`.
8. **Advanced Settings → Tag firing options → Once per event**.
9. Save.

The chatbot never sends `kosick_contact_lead`, so chat leads are not counted by this tag.

## Step 3: new phone conversion tag (clone the call tag)

1. Open the Google Ads Conversion Tracking tag whose label starts `ZX2WCMK…`.
2. **⋮ menu → Duplicate**; open the copy and rename it `Google Ads - Conversion - Phone click (CAD 200)`.
3. **Conversion Label**: the new phone label. **Conversion Value** `200`, **Currency Code** `CAD`.
4. Leave the trigger as copied (the `tel:` link-click trigger). Firing option should already be **Once per event**.
5. Save.

Every `tel:` link on the site now uses `tel:+16049255800` (Calgary is `tel:+14038099450`), and the trigger counts both.

## Step 4: fix the existing form conversion (recommended)

The original form tag `a619…` is the only conversion tag set to **Once per page**, so a second lead in the same visit is not counted. Open it:

1. **Advanced Settings → Tag firing options → Once per event**.
2. **Transaction ID**: `{{DLV - transaction_id}}`.
3. Save.

This changes reporting: leads that were previously dropped will now be counted. Note the publish date so the change can be told apart in the figures.

## Step 5: preview before publishing

Preview fires the real tags, so a test conversion is a real conversion. Test once.

1. **Preview** → enter `https://www.kosick.com` → Connect.
2. Click a `tel:` link on the site. In the Tag Assistant timeline, open the link-click event: the call tag and the new phone tag should each show **Tags Fired**, each once.
3. A form test needs a real submission. **Do not submit one without Bretton's approval**; if approved, mark it clearly as a test (for example, name `[TEST] Kosick`). On the `kosick_contact_lead` event, both form tags should show **Tags Fired** once, and the **Data Layer** tab should show `transaction_id`, `lead_email` (lower case) and `lead_phone` (starting `+1`).
4. A form submitted with a required field missing must show no `kosick_contact_lead` event at all, and neither must a newsletter signup (that one sends `kosick_newsletter_signup`).

## Step 6: publish

1. **Submit** → give the version a name such as `Add new lead and phone conversions` and describe the changes.
2. **Publish**. Write down the version number (the container was on 13).
3. Within a few minutes, check **Versions** shows it as live.

## Step 7: after publishing

- In Google Ads, open Goals → Conversions after a day: the two new actions should leave "Unverified" and show recent conversions.
- Check the existing three actions still record conversions.
- Do not report the conversion tracking as fully restored until the action statuses and the conversion counts have been checked in Google Ads.

## Roll back

GTM → **Versions** → open version 13 → **Publish** (or the version before your change). The website needs nothing.
