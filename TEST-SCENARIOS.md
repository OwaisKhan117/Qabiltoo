# ✅ Qabiltoo — 100 Manual Test Scenarios

**How to use:** Start the app (`bun run dev` + realtime service, or Docker). Test in Chrome.
Do each test from top to bottom. Mark ✅ Pass or ❌ Fail in the last column. Write down the test number of anything that fails.

> Tip: For mobile tests, press `F12` → click the small phone icon (device toolbar) → choose iPhone.

---

## 1. Home Page (Tests 1–9)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 1 | Open the website | Home page opens, no errors, no white screen | ☐ |
| 2 | Look at the top of the home page | Big green hero section with couple image and gold design shows | ☐ |
| 3 | Move your mouse over the hero card | Card tilts / moves slightly following the mouse | ☐ |
| 4 | Watch the statistics numbers | Numbers (members, matches) count up with animation | ☐ |
| 5 | Look at the live activity ticker | Shows activities like "new member joined" and keeps updating | ☐ |
| 6 | Watch the success stories carousel | Cards slide automatically; arrow buttons also work | ☐ |
| 7 | Scroll down to "How It Works" | Shows 4–5 clear steps in order | ☐ |
| 8 | Check the trust badges section | Badges (Verified, Safe, Private) are visible and clean | ☐ |
| 9 | Scroll to the very bottom | Footer shows all links and sits at the bottom — no white gap below it | ☐ |

## 2. Navigation & Layout (Tests 10–15)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 10 | Click every menu link one by one | Each link opens the correct page | ☐ |
| 11 | Click the logo | You return to the home page | ☐ |
| 12 | Press the browser Back button | Goes back to the previous page correctly | ☐ |
| 13 | On mobile width, tap the menu icon | Hamburger menu opens and shows all links | ☐ |
| 14 | Look at the menu while on any page | The current page's menu item is highlighted | ☐ |
| 15 | Click all footer links | No broken (blank/404) pages | ☐ |

## 3. Registration / Onboarding (Tests 16–26)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 16 | Click "Join / Register" | Multi-step form opens with a progress bar showing steps | ☐ |
| 17 | Type an invalid phone number | Red error message shows, cannot go next | ☐ |
| 18 | Type a valid phone number and press Next | OTP screen appears (demo OTP is displayed on screen) | ☐ |
| 19 | Enter a wrong OTP | Red error message appears | ☐ |
| 20 | Enter the correct OTP | Moves to the next step smoothly | ☐ |
| 21 | Select gender (Male / Female) | Selected option is clearly highlighted | ☐ |
| 22 | Choose "Myself" vs "Family member (wakeel)" | Choosing wakeel shows extra family fields | ☐ |
| 23 | Fill name, age, city | The live preview card on the right updates as you type | ☐ |
| 24 | Drag and drop a photo | Photo appears in the preview; remove option works | ☐ |
| 25 | Leave required fields empty and press Next | Form shows errors and does not move forward | ☐ |
| 26 | Complete the verification step | Star loader → green check → golden celebration screen appears | ☐ |

## 4. Discover (Tests 27–35)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 27 | Open the Discover page | Profile cards load in a grid with photos | ☐ |
| 28 | Look at profile photos | Photos are blurred with a lock icon (privacy) | ☐ |
| 29 | Switch between Grid view and List view | Layout changes, same profiles still show | ☐ |
| 30 | Open the filter sidebar | Filters available: age, city, education, gender | ☐ |
| 31 | Apply an age filter | List updates instantly, page does not reload | ☐ |
| 32 | Apply a city filter | Only profiles from that city show | ☐ |
| 33 | Set filters that match nothing | A friendly "no results found" message shows | ☐ |
| 34 | Click Save (heart) on a profile card | Heart fills with a small animation | ☐ |
| 35 | Check "Today's Picks" section | Featured profiles show at the top | ☐ |

## 5. Profile Detail (Tests 36–41)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 36 | Click any profile card | Profile detail page opens with full info | ☐ |
| 37 | Click a photo in the album | Big photo viewer opens; arrows move next/previous; X closes it | ☐ |
| 38 | Hover over the trust badges | A tooltip explains what each badge means | ☐ |
| 39 | Look for the wali / guardian card | Guardian information card is visible | ☐ |
| 40 | Click "Send Proposal" (big gold button) | Success message shows; button changes to "Sent" state | ☐ |
| 41 | Look for Report / Block options | They exist but are small and subtle (not prominent) | ☐ |

## 6. Interests & Matches (Tests 42–47)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 42 | Open the Interests page | "Sent" and "Received" proposal lists show | ☐ |
| 43 | Send a proposal from a profile | It appears in your "Sent" list | ☐ |
| 44 | Accept a received proposal | Match unlock animation (two patterns joining) plays | ☐ |
| 45 | Decline a received proposal | It is marked declined / removed from list | ☐ |
| 46 | Open "Who viewed me" as a free user | Blurred previews with a premium lock icon | ☐ |
| 47 | Complete a mutual match | A toast notification appears and chat becomes available | ☐ |

## 7. Chat — Realtime (Tests 48–55)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 48 | Open Chat from the menu | Chat page opens with a conversation list | ☐ |
| 49 | Open any conversation | Old messages show; input box is ready | ☐ |
| 50 | Type "Assalamu Alaikum" and send | Message bubble appears on the right side | ☐ |
| 51 | Keep chat open while other user types | "typing…" indicator appears | ☐ |
| 52 | Wait after sending a message | Read receipt (double tick / "Seen") appears | ☐ |
| 53 | Look at the top of the chat window | Privacy reminder banner is visible | ☐ |
| 54 | Open chat of a mutual match | "Request Video Call" button is available | ☐ |
| 55 | Guardian (wali) joins the conversation | Guardian messages show with a special badge | ☐ |

## 8. Guardian (Wali) Dashboard (Tests 56–59)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 56 | Open the Guardian dashboard | Approval queue shows pending proposals | ☐ |
| 57 | Approve a proposal | Status changes to approved; confirmation toast shows | ☐ |
| 58 | Reject a proposal | It moves to the rejected list | ☐ |
| 59 | Look at the activity chart | Chart renders correctly with data bars/lines | ☐ |

## 9. Trust & Verification Center (Tests 60–63)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 60 | Open Trust & Safety page | Three badge tiers (Blue / Green / Gold) explained clearly | ☐ |
| 61 | Look at the Trust Score | Circular ring shows the score with animation | ☐ |
| 62 | Read the Islamic etiquette guide | Guidelines text is readable and well formatted | ☐ |
| 63 | Watch the verification badges | Badges have a soft pulse/glow animation | ☐ |

## 10. Pricing (Tests 64–70)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 64 | Open the Pricing page | 4 plans show: Free, Silver, Gold, Platinum | ☐ |
| 65 | Look at the Gold plan | Looks special: raised card, glowing border, "Most Popular" ribbon | ☐ |
| 66 | Switch Monthly → Quarterly → Yearly | Prices update correctly; yearly shows a discount | ☐ |
| 67 | Click "Choose Gold" | Checkout / payment placeholder opens | ☐ |
| 68 | Open the billing FAQ accordion | Opens and closes smoothly | ☐ |
| 69 | Compare plan features | Each plan lists its own features clearly | ☐ |
| 70 | Check the price math (e.g., yearly = 10× monthly) | Numbers are correct, no wrong currency | ☐ |

## 11. Success Stories (Tests 71–74)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 71 | Open Success Stories page | Masonry grid shows story cards with photos | ☐ |
| 72 | Click a story card | Card flips / expands to show the full story | ☐ |
| 73 | Close the expanded story | Returns cleanly to the grid | ☐ |
| 74 | Check all story images | Every image loads (no broken image icons) | ☐ |

## 12. The Islamic Way (Tests 75–76)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 75 | Open The Islamic Way page | Editorial page opens with headings and geometric pattern decorations | ☐ |
| 76 | Read the page language | Respectful tone; no dating words anywhere (no "date", no "swipe") | ☐ |

## 13. FAQ / About / Contact (Tests 77–81)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 77 | Click FAQ questions one by one | Answer opens; previous answer closes (accordion) | ☐ |
| 78 | Open the About page | Mission / company content shows nicely | ☐ |
| 79 | Open the Contact page | Form shows: name, email, message | ☐ |
| 80 | Press submit with empty fields | Validation errors show in red | ☐ |
| 81 | Fill the form and submit | Success message appears | ☐ |

## 14. Admin Panel (Tests 82–91)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 82 | Open the Admin panel | Dashboard loads with stat cards (users, matches, reports) | ☐ |
| 83 | Compare stats with data | Numbers match real data (e.g., 20 demo profiles) | ☐ |
| 84 | Look at the charts | Graphs render correctly with labels | ☐ |
| 85 | Open the verification queue | Pending ID verifications are listed | ☐ |
| 86 | Approve a verification | User badge upgrades; row leaves the queue | ☐ |
| 87 | Reject a verification | Status changes with a reason | ☐ |
| 88 | Open reports / moderation | Reported content is listed | ☐ |
| 89 | Take an action (Warn / Suspend / Ban) | Action applies and the list updates | ☐ |
| 90 | Manage stories (add or hide one) | Change shows on the Success Stories page | ☐ |
| 91 | Edit a FAQ | Change shows on the FAQ page | ☐ |

## 15. Mobile & Responsive (Tests 92–96)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 92 | Set browser to phone width | No horizontal scrolling; layout stacks vertically | ☐ |
| 93 | Use filters on mobile | Filter opens as a drawer / bottom sheet | ☐ |
| 94 | Tap buttons on touch | Buttons are big enough to tap easily | ☐ |
| 95 | Use chat on mobile | Keyboard works; messages are readable | ☐ |
| 96 | Check all pages on mobile | No text overflow, nothing cut off | ☐ |

## 16. General / Performance / Errors (Tests 97–100)

| # | What to do | What should happen | Pass? |
|---|---|---|---|
| 97 | Reload (F5) every main page | Page opens correctly every time — never a blank white screen | ☐ |
| 98 | Time the home page load | Loads within a few seconds; loading spinners show while waiting | ☐ |
| 99 | Open browser console (F12 → Console) while using the app | No red errors during normal use | ☐ |
| 100 | Turn off internet for 10 seconds, then back on | App shows a friendly error (no crash) and recovers after reconnection | ☐ |

---

## 📋 Result Summary

| Module | Tests | Passed | Failed |
|---|---|---|---|
| Home Page | 1–9 | | |
| Navigation | 10–15 | | |
| Registration | 16–26 | | |
| Discover | 27–35 | | |
| Profile Detail | 36–41 | | |
| Interests & Matches | 42–47 | | |
| Chat | 48–55 | | |
| Guardian Dashboard | 56–59 | | |
| Trust Center | 60–63 | | |
| Pricing | 64–70 | | |
| Success Stories | 71–74 | | |
| Islamic Way | 75–76 | | |
| FAQ / About / Contact | 77–81 | | |
| Admin Panel | 82–91 | | |
| Mobile & Responsive | 92–96 | | |
| General / Errors | 97–100 | | |

**Total: 100 tests** — If any test fails, write the test number here: ______________
