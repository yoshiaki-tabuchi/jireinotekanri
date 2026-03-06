-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalNotice" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "employee_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" INTEGER NOT NULL,
    "before_change" TEXT,
    "after_change" TEXT,
    "note" TEXT,
    "delete_flag" BOOLEAN NOT NULL DEFAULT false,
    "registration_date" TIMESTAMP(3) NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalNotice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" BIGSERIAL NOT NULL,
    "post_id" VARCHAR(4) NOT NULL,
    "post_name" VARCHAR(20) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "note" VARCHAR(500),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Affiliation" (
    "id" BIGSERIAL NOT NULL,
    "affiliation_id" VARCHAR(4) NOT NULL,
    "affiliation_name" VARCHAR(20) NOT NULL,
    "department_name" VARCHAR(20),
    "division_name" VARCHAR(20),
    "person_in_charge_name" VARCHAR(20),
    "status" BOOLEAN NOT NULL DEFAULT false,
    "note" VARCHAR(500),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "Affiliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" BIGSERIAL NOT NULL,
    "employee_id" VARCHAR(4) NOT NULL,
    "employee_name" VARCHAR(20) NOT NULL,
    "employee_kana" VARCHAR(20),
    "gender" BOOLEAN NOT NULL DEFAULT false,
    "birthday" DATE,
    "registration_date" DATE,
    "Author" VARCHAR(20),
    "last_updated" DATE,
    "last_author" VARCHAR(20),
    "delete_flag" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "employee_note" VARCHAR(500),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeInfoCP" (
    "id" BIGSERIAL NOT NULL,
    "employee_id" VARCHAR(4) NOT NULL,
    "joiningDay" DATE NOT NULL,
    "retireDay" DATE,
    "Fixed_term_classification" BOOLEAN NOT NULL DEFAULT false,
    "mailaddress_company" VARCHAR(40) NOT NULL,
    "phonenumber_company" VARCHAR(40) NOT NULL,
    "phonemail_company" VARCHAR(40) NOT NULL,
    "groupmail_company" BOOLEAN NOT NULL DEFAULT false,
    "position_id1" VARCHAR(2) NOT NULL,
    "affiliation_code1" VARCHAR(4) NOT NULL,
    "position_id2" VARCHAR(2),
    "affiliation_code2" VARCHAR(4),
    "position_id3" VARCHAR(2),
    "affiliation_code3" VARCHAR(4),
    "company_note" VARCHAR(500),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "EmployeeInfoCP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeInfoIN" (
    "id" BIGSERIAL NOT NULL,
    "employee_id" VARCHAR(4) NOT NULL,
    "post_code1" VARCHAR(20) NOT NULL,
    "address1_1" VARCHAR(40) NOT NULL,
    "address1_2" VARCHAR(40) NOT NULL,
    "post_code2" VARCHAR(20),
    "address2_1" VARCHAR(40),
    "address2_2" VARCHAR(40),
    "phoneNumber" VARCHAR(20),
    "phoneNumber_ind" VARCHAR(20),
    "mailaddress_ind" VARCHAR(40),
    "ind_note" VARCHAR(500),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "EmployeeInfoIN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobilePhone" (
    "id" BIGSERIAL NOT NULL,
    "IMEI" TEXT,
    "career" VARCHAR(20) NOT NULL,
    "model" BOOLEAN NOT NULL,
    "color" VARCHAR(20),
    "plan" VARCHAR(40),
    "phoneNumber" VARCHAR(20) NOT NULL,
    "phonemailaddress" VARCHAR(40),
    "contractyearmonth" DATE NOT NULL,
    "contractterm" INTEGER NOT NULL,
    "employee_id1" VARCHAR(4),
    "lonedate1" DATE,
    "returndate1" DATE,
    "employee_id2" VARCHAR(4),
    "lonedate2" DATE,
    "returndate2" DATE,
    "employee_id3" VARCHAR(4),
    "lonedate3" DATE,
    "returndate3" DATE,
    "status" INTEGER NOT NULL,
    "phone_note" VARCHAR(500),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "MobilePhone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
