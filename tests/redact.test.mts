import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { redactSurname } from "../src/lib/redact.ts";

/**
 * The surname here is invented on purpose. The real one lives only in the
 * REDACT_SURNAME environment variable, and this repository is public.
 */
const FAKE = "Quill";
let saved: string | undefined;

before(() => {
  saved = process.env.REDACT_SURNAME;
  process.env.REDACT_SURNAME = FAKE;
});
after(() => {
  if (saved === undefined) delete process.env.REDACT_SURNAME;
  else process.env.REDACT_SURNAME = saved;
});

describe("redactSurname", () => {
  test("English titles become Ms. Aponte", () => {
    assert.equal(redactSurname("I met Mrs. Quill in 2004."), "I met Ms. Aponte in 2004.");
    assert.equal(redactSurname("Thank you, Ms Quill!"), "Thank you, Ms. Aponte!");
    assert.equal(redactSurname("Gracias, Ms. Quill-Te quiero"), "Gracias, Ms. Aponte-Te quiero");
  });

  test("Spanish titles become Sra. Aponte", () => {
    assert.equal(redactSurname("La señora Quill fue mi consejera"), "La Sra. Aponte fue mi consejera");
    assert.equal(redactSurname("Sra. Quill"), "Sra. Aponte");
  });

  test("other titles keep their title", () => {
    assert.equal(redactSurname("Prof. Quill taught me"), "Prof. Aponte taught me");
  });

  test("her name with the surname becomes Sandra Aponte", () => {
    assert.equal(redactSurname("I worked with Sandra Quill at Hillhouse"), "I worked with Sandra Aponte at Hillhouse");
    assert.equal(redactSurname("Sandra Aponte de Quill"), "Sandra Aponte");
    assert.equal(redactSurname("Sandra A. Quill"), "Sandra Aponte");
  });

  test("anything else is removed, or Aponte for a possessive", () => {
    assert.equal(redactSurname("The Quill family"), "The family");
    assert.equal(redactSurname("Quill's class was my favorite"), "Aponte's class was my favorite");
  });

  test("case doesn't matter", () => {
    assert.equal(redactSurname("MRS. QUILL"), "Ms. Aponte");
  });

  test("words that only contain it are left alone", () => {
    assert.equal(redactSurname("Quillon and Quillsworth"), "Quillon and Quillsworth");
  });

  test("text without it, null, and an unset variable pass through", () => {
    assert.equal(redactSurname("Sandra was wonderful."), "Sandra was wonderful.");
    assert.equal(redactSurname(null), null);
    delete process.env.REDACT_SURNAME;
    assert.equal(redactSurname("Mrs. Quill"), "Mrs. Quill");
    process.env.REDACT_SURNAME = FAKE;
  });
});
