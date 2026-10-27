// MPLT Lab 1 - 01 NARROWING: make the compiler prove it is safe          (10 min, pairs)
// Lecture 2, slides 13-14.
//
// GOAL : 0 red underlines AND every line in the Logs tab says PASS.
// RULES: do NOT use  any ,  as  or the  !  operator.
//        Use  if ,  typeof ,  === null ,  === undefined .

interface User { id: number; name: string; email: string | null; }

const users = new Map<number, User>([
  [1, { id: 1, name: "Aysel", email: "aysel@example.com" }],
  [2, { id: 2, name: "Murad", email: null }],
]);

// TASK 1 - Map.get returns  User | undefined .
function userName(id: number): string {
  const u = users.get(id);
  if (u === undefined) {
    return "unknown";
  }
  return u.name;
}

// TASK 2 - two layers of absence: the user may be missing AND the email may be null.
function emailDomain(id: number): string {
  const u = users.get(id);
  if (u === undefined) {
    return "no email";
  }
  if (u.email === null) {
    return "no email";
  }
  const parts = u.email.split("@");
  const domain = parts[1]; // may be string | undefined under noUncheckedIndexedAccess
  if (domain === undefined) {
    return "no email";
  }
  return domain;
}

// TASK 3 - typeof narrowing.
//   number -> "#0042"  (pad to 4 digits)        string -> "#AB-7"  (upper case)
function formatId(id: number | string): string {
  if (typeof id === "number") {
    return "#" + id.toString().padStart(4, "0");
  }
  return "#" + id.toUpperCase();
}

// TASK 4 - 0 is a valid quantity, only null means "unknown".
// The old check  if (qty)  treated 0 as falsy, so label(0) returned "unknown".
function label(qty: number | null): string {
  if (qty === null) {
    return "unknown";
  }
  return "qty=" + qty;
}

// ---- self-check (do not edit) -------------------------------------------------
function check(name: string, f: () => unknown, expected: unknown) {
  let got: unknown;
  try { got = f(); } catch (e) { got = "CRASH " + String(e); }
  const ok = JSON.stringify(got) === JSON.stringify(expected);
  console.log((ok ? "PASS  " : "FAIL  ") + name + (ok ? "" : "   got " + JSON.stringify(got) + ", expected " + JSON.stringify(expected)));
}
check("T1 userName(1)", () => userName(1), "Aysel");
check("T1 userName(9)", () => userName(9), "unknown");
check("T2 emailDomain(1)", () => emailDomain(1), "example.com");
check("T2 emailDomain(2)", () => emailDomain(2), "no email");
check("T2 emailDomain(9)", () => emailDomain(9), "no email");
check("T3 formatId(42)", () => formatId(42), "#0042");
check("T3 formatId('ab-7')", () => formatId("ab-7"), "#AB-7");
check("T4 label(0)", () => label(0), "qty=0");
check("T4 label(null)", () => label(null), "unknown");

// DISCUSS when done:
//   Task 4 had no red underline but was wrong. What does that say about
//   "if it compiles, it works"? (Lecture 2, slide 6, last bullet.)
//   -> The compiler checks types, not intent. `if (qty)` is valid for
//      number | null, but it also rejects 0. Compiling != correct.
