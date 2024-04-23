-- CreateTable
CREATE TABLE "comment" (
    "id" UUID NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "id_employee" UUID NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(180),
    "phone_number" VARCHAR(15),
    "landline_phone" VARCHAR(15),
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "id_company_direct_contact" UUID,
    "id_form" UUID,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_direct_contact" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(70) NOT NULL,
    "last_name" VARCHAR(70) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "phone_number" VARCHAR(15),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "company_direct_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" UUID NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(70) NOT NULL,
    "last_name" VARCHAR(70) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "phone_number" VARCHAR(15),
    "image_url" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "id_department" UUID,
    "id_role" UUID NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_notification" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "id_employee" UUID NOT NULL,
    "id_notification" UUID NOT NULL,

    CONSTRAINT "employee_notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_task" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "id_employee" UUID NOT NULL,
    "id_task" UUID NOT NULL,

    CONSTRAINT "employee_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense" (
    "id" UUID NOT NULL,
    "title" VARCHAR(70) NOT NULL,
    "justification" VARCHAR(255) NOT NULL,
    "total_amount" DECIMAL(18,2) NOT NULL,
    "status" VARCHAR(256),
    "category" VARCHAR(70),
    "date" DATE NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "id_report" UUID NOT NULL,
    "id_file" UUID,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_report" (
    "id" UUID NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "status" VARCHAR(256),
    "total_amount" DECIMAL(8,2),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "id_employee" UUID NOT NULL,

    CONSTRAINT "expense_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" UUID NOT NULL,
    "description" VARCHAR(256),
    "format" VARCHAR(256) NOT NULL DEFAULT '.zip',
    "url" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form" (
    "id" UUID NOT NULL,
    "title" VARCHAR(70) NOT NULL,
    "email" VARCHAR(180),
    "client_name" VARCHAR(70),
    "applicant_name" VARCHAR(70),
    "phone_num" VARCHAR(15),
    "landline_num" VARCHAR(15),
    "address" VARCHAR(256),
    "passport" VARCHAR(70),
    "company_names" VARCHAR(256),
    "company_type" VARCHAR(256),
    "corporate_purpose" VARCHAR(70),
    "mexican_address" VARCHAR(256),
    "fixed_capital_stock" DECIMAL(18,2),
    "variable_capital_stock" DECIMAL(18,2),
    "values_per_share" DECIMAL(18,2),
    "num_shares_per_shareholder" VARCHAR(256),
    "partner_capital_stock" VARCHAR(256),
    "management_form" VARCHAR(256),
    "general_manager_name" VARCHAR(70),
    "power_attorney_general_manager" VARCHAR(256),
    "special_clause_general_manager" VARCHAR(256),
    "chairman_name" VARCHAR(70),
    "power_attorney_chairman" VARCHAR(256),
    "special_clause_chairman" VARCHAR(256),
    "secretary_board_name" VARCHAR(70),
    "power_attorney_secretary_board" VARCHAR(256),
    "special_clause_secretary_board" VARCHAR(256),
    "names_board_members" VARCHAR(256),
    "supervisory_board_names" VARCHAR(256),
    "power_attorney_zeitgeist_team" VARCHAR(256),
    "special_clause_zeitgeist_team" VARCHAR(256),
    "grant_power_attorney_other" VARCHAR(256),
    "name_attorney_one" VARCHAR(70),
    "power_attorney_one" VARCHAR(256),
    "special_clause_attorney_one" VARCHAR(256),
    "name_attorney_two" VARCHAR(70),
    "power_attorney_two" VARCHAR(256),
    "special_clause_attorney_two" VARCHAR(256),
    "name_attorney_three" VARCHAR(70),
    "power_attorney_three" VARCHAR(256),
    "special_clause_attorney_three" VARCHAR(256),
    "name_attorney_four" VARCHAR(70),
    "power_attorney_four" VARCHAR(256),
    "special_clause_attorney_four" VARCHAR(256),
    "name_attorney_five" VARCHAR(70),
    "power_attorney_five" VARCHAR(256),
    "special_clause_attorney_five" VARCHAR(256),
    "questionnaire_questions" VARCHAR(256),
    "additional_questions" VARCHAR(256),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" UUID NOT NULL,
    "title" VARCHAR(70) NOT NULL,
    "body" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL,
    "name" VARCHAR(70) NOT NULL,
    "matter" VARCHAR(70),
    "description" VARCHAR(255),
    "status" VARCHAR(256) NOT NULL DEFAULT 'Not started',
    "category" VARCHAR(256) NOT NULL DEFAULT '-',
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "total_hours" DECIMAL(8,2),
    "periodicity" VARCHAR(256),
    "is_chargeable" BOOLEAN,
    "area" VARCHAR(256),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "id_company" UUID NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" UUID NOT NULL,
    "title" VARCHAR(256) NOT NULL DEFAULT 'Sin rol',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" UUID NOT NULL,
    "title" VARCHAR(70) NOT NULL,
    "description" VARCHAR(256) NOT NULL,
    "status" VARCHAR(256) NOT NULL,
    "waiting_for" VARCHAR(70),
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "worked_hours" DECIMAL(8,2),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "id_project" UUID NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_email_key" ON "company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "company_direct_contact_email_key" ON "company_direct_contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_phone_number_key" ON "employee"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "file_url_key" ON "file"("url");

-- CreateIndex
CREATE UNIQUE INDEX "form_email_key" ON "form"("email");

-- CreateIndex
CREATE UNIQUE INDEX "form_phone_num_key" ON "form"("phone_num");

-- CreateIndex
CREATE UNIQUE INDEX "form_landline_num_key" ON "form"("landline_num");

-- CreateIndex
CREATE UNIQUE INDEX "form_address_key" ON "form"("address");

-- CreateIndex
CREATE UNIQUE INDEX "form_passport_key" ON "form"("passport");

-- CreateIndex
CREATE UNIQUE INDEX "form_mexican_address_key" ON "form"("mexican_address");

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_id_company_direct_contact_fkey" FOREIGN KEY ("id_company_direct_contact") REFERENCES "company_direct_contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_id_form_fkey" FOREIGN KEY ("id_form") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_id_department_fkey" FOREIGN KEY ("id_department") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_notification" ADD CONSTRAINT "employee_notification_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_notification" ADD CONSTRAINT "employee_notification_id_notification_fkey" FOREIGN KEY ("id_notification") REFERENCES "notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_task" ADD CONSTRAINT "employee_task_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_task" ADD CONSTRAINT "employee_task_id_task_fkey" FOREIGN KEY ("id_task") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_id_file_fkey" FOREIGN KEY ("id_file") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_id_report_fkey" FOREIGN KEY ("id_report") REFERENCES "expense_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "expense_report" ADD CONSTRAINT "expense_report_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_id_company_fkey" FOREIGN KEY ("id_company") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_id_project_fkey" FOREIGN KEY ("id_project") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
