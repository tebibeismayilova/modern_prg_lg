# Lab 2 Report

## What I did
- Step 1: binary minus `-`, same grammar level as `+` (`sum`), left-associative, so `8 - 3 - 2` gives `((8 - 3) - 2)`.
- Step 2: multiplication `*` with a new grammar level `term`, so `*` binds tighter than `+` and `-`.
- Step 3: typing rules T-Sub and T-Mul (`int, int => int`).
- Step 4: `true` / `false` as keywords (so `trueish` is still an identifier) and rule T-Bool.
- Step 5: unary minus with a new level `unary = "-" unary | primary`, which binds tighter than `*`. Recursion makes `--1` work. Rule T-Neg: `int => int`.
- Step 6: `>=` and `==` at the same level as `>`. In `RULES`, `">="` must come BEFORE `">"`, because `matchAt` returns the first rule that matches. Otherwise `a>=b` would be lexed as `>` and then fail on `=`.

## Decision: which types may `==` compare?
T-Eq: `e1 : T, e2 : T  =>  e1 == e2 : bool` for any T in {int, string, bool}.
Both sides must have the SAME type. Reasons:
- Comparing `1 == "a"` is almost surely a bug, so the checker rejects it, the same way it rejects `1 + "a"`.
- Equality makes sense for all three types here, so restricting it to int only (like `>`) would be needlessly strict.
- The rule stays simple and has the same shape as T-If's "both branches have the same type".

## Result
`CORE DONE`, and all stretch steps (4, 5, 6) pass.
