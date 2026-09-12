## Product Story — Customer & Supplier Registration

### 1. Product vision

**Ventistål needs a simple and controlled way to collect and register customer and supplier information.**

The application should move the responsibility for providing accurate information from Ventistål employees to the **customer or supplier themselves**, while giving Ventistål control over the process, validation and final registration.

The target process is:

**Ventistål employee → Registration request → Customer/Supplier → Data submission → Ventistål review → Validation/Registration → Internal systems**

The application should support two registration types:

- **Supplier registration**
- **Customer registration**

The process and subsequent actions may differ depending on the type.

------

# 2. Main user story

> **As a Ventistål employee, I want to request customer or supplier information from an external stakeholder through a controlled digital process, so that the stakeholder can provide their own information and Ventistål can subsequently validate and register it in the appropriate internal systems.**

### Expected outcome

The application should:

1. Allow Ventistål to initiate a registration request.
2. Send the request to the stakeholder by email.
3. Provide a secure, single-use link.
4. Allow the stakeholder to enter the required information.
5. Submit the information back to Ventistål.
6. Allow Ventistål to process the submission according to whether it is a customer or supplier.
7. Provide sufficient status and traceability throughout the process.

------

# 3. Main workflow

### Step 1 — Create registration request

A Ventistål employee creates a new registration request.

The employee must provide at least:

- Stakeholder email address
- Registration type:
  - Customer
  - Supplier

The system generates a registration request associated with that email and type.

**Open question:** Should the employee also provide the company name, organisation number, contact person or other initial information?

------

### Step 2 — Send invitation

The stakeholder receives an email containing a link to the registration form.

The link should:

- Be unique to the registration request.
- Be usable only once, or become unusable after successful submission.
- Expire after a defined period.
- Be associated with the intended registration request.
- Not expose sensitive information through the URL.

**Open questions:**

- How long should the link remain valid?
- What happens when the link expires?
- Can Ventistål resend the invitation?
- Does resending invalidate the previous link?
- Can the stakeholder save and continue later?
- What happens if the email address was entered incorrectly?

------

### Step 3 — Stakeholder completes the form

The stakeholder accesses the link and provides the required information.

The form should collect **only the information actually required by Ventistål**.

The exact fields should be defined separately for:

**Supplier**

- Company information
- Contact information
- Registration/VAT information
- Banking/payment information
- Required declarations/documents

**Customer**

- Company information
- Contact information
- Registration/VAT information
- Other information required to determine whether the customer is valid

The stakeholder should be able to review the information before submitting it.

------

### Step 4 — Submit registration

The stakeholder confirms that the information is correct and submits the registration.

After submission:

- The registration becomes read-only for the stakeholder.
- Ventistål receives the submitted registration.
- The registration status changes.
- The responsible Ventistål employee can process it.

A confirmation should be shown to the stakeholder.

**Open question:** Should the stakeholder receive a confirmation email?

------

# 4. Ventistål processing

From this point, the workflow differs depending on the registration type.

## Supplier

The submitted supplier information is reviewed by Ventistål.

If accepted:

**Submitted → Reviewed → Registered in Ventistål systems**

The supplier information is then entered/integrated into the relevant internal systems.

**Important open question:** Is the registration considered "approved" before or after the supplier has actually been successfully created in the internal system?

------

## Customer

Customers require an additional validation step.

The expected process is:

**Submitted → Customer validation → Valid customer → Registered in Ventistål systems**

The customer must first pass the required validation before it can be registered internally.

The validation should therefore be explicitly represented in the workflow.

For example:

```
Submitted
   │
   ▼
Customer validation
   │
   ├── Invalid → Rejected
   │
   └── Valid
        │
        ▼
Registered in internal systems
```

**Important open question:** What exactly constitutes a "valid customer"?

This needs to be defined as a business rule rather than assumed.

------

# 5. Possible statuses

A first proposal would be:

| Status                | Meaning                                                |
| --------------------- | ------------------------------------------------------ |
| `REQUESTED`           | Ventistål has created the request                      |
| `SENT`                | Invitation has been sent                               |
| `IN_PROGRESS`         | Stakeholder has opened/started the form                |
| `SUBMITTED`           | Stakeholder has submitted the information              |
| `UNDER_REVIEW`        | Ventistål is reviewing the submission                  |
| `CORRECTION_REQUIRED` | Ventistål needs additional/corrected information       |
| `VALIDATED`           | Customer validation has succeeded                      |
| `REJECTED`            | Registration has been rejected                         |
| `REGISTERED`          | Successfully registered in Ventistål's internal system |

For the MVP, we should avoid adding statuses unless they correspond to a real business state.

------

# 6. Correction workflow

One important question is what happens when the stakeholder submits incorrect or incomplete information.

I would propose supporting:

**Ventistål → Request correction → Stakeholder → Update information → Resubmit → Ventistål**

For example:

```
Submitted
   │
   ▼
Ventistål review
   │
   ▼
Correction required
   │
   ▼
Stakeholder receives new link
   │
   ▼
Updates information
   │
   ▼
Resubmits
```

This is likely preferable to requiring Ventistål employees to manually correct stakeholder data.

**Open questions:**

- Can the stakeholder modify all fields?
- Should Ventistål provide a reason for the correction?
- Can there be multiple correction cycles?
- Does each correction require a new secure link?
- Should previous submissions be retained for audit purposes?

------

# 7. Problems / risks to resolve

### Identity of the stakeholder

The email recipient may not necessarily be the person or company that should provide the information.

The system therefore needs to clarify:

> **How much trust does Ventistål place in possession of the email link?**

This is particularly important for sensitive information such as banking details.

The current story does **not yet define an identity verification mechanism**.

------

### Duplicate registrations

What happens if Ventistål creates two requests for the same company?

The system should potentially detect or warn about existing registrations.

**Open question:** Which identifier should be used to detect duplicates?

For example, organisation number may be appropriate, but this needs business confirmation.

------

### Expired links

A stakeholder may receive the email but not complete the form before the link expires.

Possible behaviour:

**Expired → Contact Ventistål → New invitation**

The system should not require an employee to manually recreate the whole request.

------

### Wrong email address

If an invitation is sent to the wrong email address, the recipient should not be able to transfer the registration to another person without an appropriate mechanism.

This is especially relevant because the registration may contain sensitive information.

------

### Abandoned registrations

A stakeholder may open the form but never submit it.

Ventistål should be able to identify these requests.

Potentially:

```
Requested
   ↓
Opened
   ↓
No activity
   ↓
Expired
```

**Open question:** Should Ventistål receive reminders or notifications?

------

# 8. First MVP test cases

## Request creation

### TC-01 — Create supplier request

**Given:** A Ventistål employee is creating a registration request
**When:** They enter a valid email and select Supplier
**Then:** A supplier registration request is created and an invitation is sent.

### TC-02 — Create customer request

Same scenario, but with Customer selected.

### TC-03 — Invalid email

**Given:** Employee enters an invalid email
**When:** They attempt to create the request
**Then:** The request cannot be submitted.

### TC-04 — Registration type missing

**Given:** Employee has entered an email
**When:** They don't select Customer/Supplier
**Then:** The request cannot be created.

------

## Invitation

### TC-05 — Valid invitation

**Given:** A valid registration request exists
**When:** The stakeholder opens the invitation
**Then:** The correct registration form is displayed.

### TC-06 — Expired invitation

**Given:** The invitation has expired
**When:** The stakeholder opens the link
**Then:** The form cannot be accessed and an appropriate message is displayed.

### TC-07 — Reuse submitted link

**Given:** The stakeholder has already submitted the form
**When:** They access the same link again
**Then:** They cannot submit the registration again.

### TC-08 — Invalid/tampered link

**Given:** The URL does not correspond to a valid registration
**When:** The stakeholder accesses it
**Then:** Access is denied.

------

## Form

### TC-09 — Mandatory fields

**Given:** The stakeholder has opened the form
**When:** They submit without completing mandatory fields
**Then:** Submission is rejected and the missing information is identified.

### TC-10 — Invalid data

For example, invalid VAT/organisation number, malformed email or invalid banking information.

The system should prevent submission where validation rules are defined.

### TC-11 — Review before submission

The stakeholder can review the complete information before confirming submission.

### TC-12 — Successful submission

**Given:** All required information is valid
**When:** The stakeholder confirms submission
**Then:** The registration is submitted to Ventistål and cannot be modified through the original invitation.

------

# 9. Customer-specific test cases

### TC-13 — Valid customer

**Given:** A customer registration has been submitted
**When:** Ventistål validates it successfully
**Then:** The customer can proceed to internal registration.

### TC-14 — Invalid customer

**Given:** A customer registration has been submitted
**When:** Validation fails
**Then:** The customer cannot be registered in the internal systems.

### TC-15 — Customer requires correction

**Given:** Ventistål identifies incorrect information
**When:** Correction is requested
**Then:** The stakeholder can update the required information and resubmit.

------

# 10. Supplier-specific test cases

### TC-16 — Supplier accepted

**Given:** A supplier registration has been submitted and reviewed
**When:** Ventistål accepts it
**Then:** The supplier can be registered in the internal system.

### TC-17 — Supplier correction

**Given:** Supplier information is incomplete/incorrect
**When:** Ventistål requests correction
**Then:** The supplier can update and resubmit the information.

------

# 11. Traceability / audit test cases

These are particularly important given the nature of the application.

### TC-18 — Registration history

The system should allow Ventistål to determine:

- Who created the request.
- When it was created.
- Which email it was sent to.
- When it was opened.
- When information was submitted.
- Who reviewed it.
- What decision was made.
- When it was registered/rejected/returned.

### TC-19 — Submitted data

Ventistål should be able to identify exactly which information was submitted by the stakeholder.

### TC-20 — Correction history

If information is corrected, Ventistål should be able to distinguish the latest information from previous submissions where required for traceability.

------

# 12. Key business decisions still required

Before turning this into a detailed specification, I would explicitly ask Ventistål to clarify these points:

1. **What exact data is required for suppliers?**
2. **What exact data is required for customers?**
3. **What makes a customer "valid"?**
4. **Who performs the customer validation?**
5. **What happens after validation?**
6. **Which internal systems must receive the data?**
7. **Is integration required, or is manual registration acceptable for the MVP?**
8. **What happens when information is incorrect?**
9. **Can stakeholders save an incomplete form?**
10. **How long are invitation links valid?**
11. **How is the stakeholder's identity/trust established?**
12. **How should banking information be handled?**
13. **What notifications/emails are required?**
14. **How are duplicate customers/suppliers handled?**
15. **What information must Ventistål retain for audit purposes?**

### A particularly important distinction

I would **not yet specify BankID, e-signatures, integrations, authentication technology, etc. as requirements**.