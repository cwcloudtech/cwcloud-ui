// instance       100,
// project       200,
// user        300,
// bucket 400,
// provider     500,
// invoice   600
// consumption 700
// environment 800
// general 1000
// inputs error 1100
export const englishLanguage = {
    error_codes: {
        "104": "Instance not found",
        "101": "Instance successfully updated",
        "102": "Instance successfully deleted",
        "105": "Instance type does not exist",
        "106": "Action does not exist",
        "107": "Instance already stopped",
        "108": "You can't stop the Instance while rebooting",
        "109": "You can't stop the Instance while starting",
        "110": "Instance already stopping",
        "111": "Instance already running",
        "112": "You can't start the Instance while rebooting",
        "113": "Instance already starting",
        "114": "You can't start the Instance while stopping",
        "115": "You can't reboot the Instance when it is stopped",
        "116": "Instance already rebooting",
        "117": "You can't reboot the Instance while starting",
        "118": "You can't reboot the Instance while stopping",
        "119": "Instance already active",
        "120": "You can't delete the instance while it is not running or stopped",
        "121": "Please specify the playbook you want to attach",
        "122": "Playbook not found",
        "123": "Instance already exist",
        "124": "Instance type in this zone not found",
        "125": "Instance type in this region not found",
        "126": "You dont have access to provision instances",
        "127": "Instance already running with this playbook",
        "204": "Project not found",
        "210": "Project not found in Gitlab",
        "202": "Project successfully deleted",
        "205": "Project still holds active instances",
        "206": "Project has no playbooks",
        "207": "Project name is missing",
        "208": "Project already exists",
        "209": "Something went wrong when deleting the project",
        "300": "User successfully created (a confirmation link has been sent by email)",
        "304": "User not found",
        "301": "User successfully updated",
        "302": "User successfully deleted",
        "303": "User successfully confirmed",
        "305": "Email already exist",
        "306": "Successfully sent confirmation email",
        "307": "User successfully verified",
        "308": "User verification failed",
        "309": "Successfully sent reset password email",
        "310": "User already been confirmed",
        "311": "Wrong password",
        "312": "The confirm token is required",
        "313": "Invalid jwt token",
        "314": "Unexpected exception",
        "400": "Invalid parameter(s)",
        "401": "Bucket successfully deleted",
        "402": "Bucket successfully updated",
        "404": "Bucket not found",
        "405": "Bucket successfully refreshed",
        "504": "Provider does not exist",
        "604": "Invoice not found",
        "601": "Invoice successfully updated",
        "704": "Consumption not found",
        "706": "Unable to generate consumption",
        "801": "Environment successfully updated",
        "802": "Environment successfully deleted",
        "804": "Environment not found",
        "803": "Environment is missing",
        "805": "Environment name is missing",
        "806": "Environment path is missing",
        "807": "Main role isnt part of selected roles",
        "808": "Path already exists",
        "901": "Registry successfully deleted",
        "902": "Registry successfully updated",
        "904": "Registry not found",
        "1001": "Permission denied",
        "1002": "Authentification failed",
        "1003": "Your account has not been confirmed yet",
        "1004": "Missing informations for login",
        "1101": "Please provide bucket name",
        "1102": "Please provide an email",
        "1103": "Bucket type does not exist",
        "1104": "Region does not exist",
        "1105": "Stack already exist",
        "1106": "Please provide instance name",
        "1107": "Please provide a project id",
        "1108": "Please provide a valid root dns zone",
        "1109": "Environment is missing",
        "1110": "zone does not exist",
        "1111": "Playbook already exist",
        "1112": "Could not send invoice pdf email",
        "1113": "Unable to create a gitlab user acount",
        "1114": "Runner not found",
        "1115": "Unable to delete gitlab runners",
        "1116": "Unable to delete gitlab project",
        "1117": "Image not found",
        "1118": "Name contains invalid caracters",
        "1119": "Name is too long",
        "1120": "Gitlab host not available",
        "1121": "A problem accured when creating the project, check your access token",
        "1122": "Please provide registry name",
        "1123": "Registry type does not exist",
        "1201": "Voucher successfully updated",
        "1202": "Voucher successfully deleted",
        "1204": "Voucher not found",
        "1205": "Voucher has expired",
        "1206": "Invalid email",
        "1207": "Missing informations",
        "1300": "A default payment method must be set and selected",
        "333333": "Invalid otp code",
        "incomplete_zip": "Your postal code is incomplete",
        "invalid_expiry_year_past": "Your card's expiration year is in the past",
        "incomplete_cvc": "Your card's security code is incomplete",
        "incomplete_number": "Your card number is incomplete",
        "invalid_number": "Your card number is invalid",
        "disabled_email_service": "The emails are disabled",
        "not_billable": "The user is not billable",
        "not_emailapi": "The user is not granted for the email API",
        "not_cwaiapi": "The user is not granted for the cwai API",
        "cwaiapi_not_enabled": "The cwai API is not enabled",
        "cwai_error": "The cwai API's answer is not ok",
        "cwai_model_notfound": "This model doesn't exists",
        "payment_method_not_found": "Payment method not found",
        "not_correct_item": "The item is not correcty serialized",
        "bad_date_aaaammdd": "Bad date format (expected: YYYY/MM/DD ou YYYY-MM-DD)",
        "not_valid_email": "The email is not valid",
        "password_too_short": "The password is too short (at least 8 characters required)",
        "password_no_number": "The password must contain at least one number",
        "password_no_upper": "The password must contain at least one capital letter",
        "password_no_lower": "The password must contain at least one lowercase letter",
        "password_no_symbol": "The password must contain at least one special char",
        "instance_name_invalid": "The instance's name is invalid (it can only contains unaccentued letters and '-')",
        "bad_invoice_ref": "The invoice reference is invalid (must contain at least 5 digits)",
        "user_id_or_email_mandatory": "The user's id or email is mandatory",
        "user_not_found": "The user doesn't exists",
        "file_not_found": "File not found",
        "invalid_api_key": "Please provide a proper name for the api key",
        "faas_invalid_parameters": "Invalid parameters",
        "faas_not_found_function": "Function doesn't exists",
        "faas_not_found_invocation": "Invocation doesn't exists",
        "faas_not_found_trigger": "Trigger doesn't exists",
        "faas_language_not_supported": "Not supported language",
        "faas_not_write_right": "You have not the write right on this function",
        "faas_not_exec_right": "You have not the exec right on this function",
        "faas_not_admin": "You have to be admin for getting this resources",
        "faas_not_granted": "The FaaS feature is not granted for you",
        "faas_wrong_args_number": "Bad number of args for this function",
        "faas_not_same_args": "The args are not the same in the function definition",
        "faas_state_undefined": "The state is required",
        "faas_state_not_known": "Invalid state (not known)",
        "faas_invalid_function_id": "The function id is not valid",
        "faas_trigger_kind_not_supported": "The trigger's kind is invalid",
        "cron_expr_invalid": "Not a valid crontab expr",
        "faas_function_name_missing": "Function name is required",
    },
    common: {
        ok: "OK",
        button: {
            create: "Create",
            add: "Add",
            delete: "Delete",
            update: "Update",
            save: "Save",
            return: "Return",
            send: "Send",
            generate: "Generate",
            edition: "Edit",
            preview: "Preview",
            download: "Download",
            upload: "Upload",
            showOptions: "Show options",
            copy: "Copy",
            reboot: "Reboot",
            delete2Fa: "Disable MFA/2FA",
            activate2Fa: "Enable MFA/2FA",
            verifyCode: "Verify Code",
            deleteU2f: "Delete your 2FA usb device",
            activateU2f: "Add 2FA usb device",
            run: "Run",
            goFullScreen: "Go full screen"
        },
        state: {
            copied: "Copied",
        },
        fields: {
            userEmail: "User email",
        },
        word: {
            or: "Or"
        },
        message: {
            thisFieldIsRequired: "This field is required",
            pleaseEnterAnEmail: "Please enter an email",
            copied: "Copied",
            warning: "Warning",
        },
        table: {
            emptyRowsMessage: "No data available"
        },
        service: {
            serviceNotAvailable: "Service not available in region"
        },
        payment: "Payment",
        confirm: "Confirm",
        admin: {
            renewCredentials: "Renew"
        }
    },
    navbar: {
        provider: "Provider",
        region: "Region",
        switchMode: "Switch mode",
        logout: "Logout",
        language: "Language",
        settings: "Settings",
        credentials: "Credentials",
        vouchers: "Vouchers",
        billing: "Billing",
        support: "Support"
    },
    billing: {
        method: "Payment methods",
        add: "Add credit card",
        invoices: "Invoices",
        gateway: "Payment gateway",
        card: {
            added: "Credit card successfully added",
            deleted: "Credit card successfully deleted"
        },
        cardInformations: "Card informations",
    },
    iam: {
        apikey: {
            generate: "Generate api key",
            downloadConfigFile: "Download config file",
            title: "Api keys",
            generated: "Generated API key",
            warning: {
                part1: "WARNING. The Secret Key will be shown only once.",
                part2: "Make sure you save it securely."
            },
            message: {
                successDownloadConfigFile: "Config file successfully downloaded",
            }
        },
        access: {
            generate: "Generate access",
            title: "Access",
            email: "Email",
            objectType: "Object Type"
        }
    },
    password: {
        reset: {
            notsame: "The passwords are not the same",
            input: "Enter your password",
            confirm: "Confirm your password",
            backToLoginQuestion: "Do you want to go back to login?",
            successMessage: "Password successfully reset",
            errorMessage: "An error occured while resetting your password",
        },
        forgotten: {
            successMessage: "A password reset link has been sent by email",
            notfound: "No account found with this email",
            inputEmail: "Enter your email"
        }
    },
    confirm: {
        messageSent: "The confirmation email has been sent with success",
        inputEmail: "Enter your email",
        successMessage: "User successfully confirmed"
    },
    cookies: {
        why: "This website uses cookies to ensure you get the best experience.",
        learnMore: "Learn more",
        understand: "I understand"
    },
    intro: {
        presentation: "This is the comwork cloud web console",
        wiki: {
            part1: "Check out our",
            part2: "documentation"
        },
    },
    login: {
        title: "Login",
        instruction: "Enter your email address and password.",
        email: "Email",
        password: "Password",
        button: "Login",
        contact: "Contact",
        question: "Don't have an acount?",
        signup: "Register",
        forgottenpassword: "Forgot password?",
        goBackToLogin: "Go back to login",
        error: {
            accountNotActivated: "Your account isn't currently activated. Contact an administrator using this email: "
        }
    },
    setup2fa: {
        title: "Setup 2FA/MFA authentication",
        scan: "Scan the QR code",
        key: "Key",
        account: "Account",
        cantScan: "Can't scan the code?",
        addManualDescription: "To add the entry manually, provide the following details to the application on your phone.",
        verificationCode: "Verification code",
        success: "Two factor authentication activated",
        verificationCodePlacehold: "Type the 6 digit verification code",
        error: "Wrong passcode, please try again.",
        instruction: {
            part1: "Follow",
            part2: "This procedure",
            part3: "So that you can setup your MFA"
        },
        usbPress: "Plug-in your USB device and press the button",
        withapp: "Sign-in with 2FA app"
    },
    multiFactorAuth: {
        title: "Two Factor authentication",
        description: "Enter the code from the two-factor app on your mobile device. If you've lost your device, you may enter one of your recovery codes.",
        verificationCode: "Verification Code",
        verificationCodePlacehold: "Type the 6 digit verification code",
        error: "Wrong code, please try again.",
        unauthorized: "You're not authenticated, please try to login again"
    },
    signup: {
        title: "Register",
        instruction: {
            part1: "Follow",
            part2: "This procedure",
            part3: "So that we can take into consideration your registration."
        },
        email: "Email *",
        company: "Company Name",
        acceptTerms: "Accept the",
        terms: "Terms of services",
        registrationNumber: "Registration Number",
        address: "Address",
        contactInformations: "Contact Informations",
        password: "Password *",
        passwordConfirmation: "Confirm your password *",
        button: "Register",
        question: "Already have an account?",
        login: "Login",
        error: {
            passwordsNotMatch: "Passwords didn't match",
            passwordsNotFound: "Please provide passwords",
            emailNotFound: "Please provide your email",
            acceptTerms: "You have to accept the terms of services in order to sign up"
        }
    },
    sidebar: {
        dashboard: "Dashboard",
        projects: "Projects",
        instances: "Instances",
        invoices: "Invoices",
        buckets: "Buckets",
        registries: "Registries",
        manageEmails: {
            title: "Emails"
        },
        cwai: "Cwai Chat",
        functions: {
            title: "Serverless",
            overview: "Overview",
            add: "Add"
        },
        invocations: {
            overview: "Invocations"
        },
        triggers: {
            overview: "Triggers"
        },
        manageUsers: {
            title: "Manage users",
            overview: "Overview",
            add: "Add"
        },
        manageEnvironments: {
            title: "Environments",
            overview: "Overview",
            add: "Add"
        },
        manageSupport: {
            title: "Manage support",
        },
        manageInstances: {
            title: "Manage instances",
            overview: "Overview",
            add: "Add"
        },
        manageFunctions: {
            title: "Serverless"
        },
        manageVouchers: {
            title: "Manage vouchers",
            overview: "Overview",
            add: "Add"
        },
        manageProjects: {
            title: "Manage projects",
            overview: "Overview",
            add: "Add"
        },
        manageInvoices: {
            title: "Manage invoices",
            overview: "Overview",
            custom: "Custom",
            generate: "Generate",
            edition: "Edit"
        },
        manageBuckets: {
            title: "Manage buckets",
            overview: "Overview",
            add: "Add"
        },
        manageRegistries: {
            title: "Manage registries",
            overview: "Overview",
            add: "Add"
        }
    },
    dashboard: {
        settings: {
            userInformations: "User informations",
            passwordManagement: "Password management",
            input: {
                email: "Email",
                address: "Address",
                companyName: "Company name",
                registrationNumber: "Registration number",
                contactInformations: "Contact informations",
                oldPassword: "Old password",
                newPassword: "New password",
                confirmPassword: "Confirm Password",
            },
            security: "Security",
            messages: {
                successDelete2Fa: "2Factor authentification successfully deleted",
            }
        },
        modal: {
            powerModal: {
                title: "%(status)s instance",
                message: "Are you sure you want to %(status)s your instance",
                button: "%(status)s"
            },
            rebootModal: {
                title: "Reboot Instance",
                message: "Are you sure you want to Reboot your instance",
                button: "Reboot"
            },
            delete: {
                resource: "Are you sure you want to delete your",
                all: "Are you sure you want to delete all selected resources?"
            }
        },
        table: {
            id: "Id",
            createdAt: "Created at",
            updatedAt: "Updated at",
            actions: "Actions",
            filter: "Filter",
            run: "Run",
            schedule: "Schedule",
            function: "Function",
            args: "Args",
            owner: "Owner"
        },
        userDashboard: {
            resourceOverview: {
                title: "Resource overview",
                projects: "Projects",
                instances: "Instances",
                buckets: "Buckets",
                registries: "Registries"
            },
            availableEnvironments: {
                title: "Available environments"
            },
            consumptions: {
                title: "Consumption",
                currentConsumptions: "Current month consumption",
                unpayedConsumptions: "Unpayed consumptions"
            }
        },
        addEnvironement: {
            mainTitle: "Create New Environment",
            back: "Back to environments",
            inputs: {
                template: {
                    title: "Environment template"
                },
                documentation: {
                    title: "Documentation"
                },
                name: {
                    title: "Name",
                    placeholder: "Put the environment name"
                },
                path: {
                    title: "Path",
                    placeholder: "Put the environment path"
                },
                subdomains: {
                    title: "Sub Domains",
                    placeholder: "Put a subdomain name"
                },
                mainRole: {
                    title: "Main role",
                    placeholder: "Choose the environment main role"
                },
                description: {
                    title: "Description",
                    placeholder: "Put the environment description"
                },
                logo_url: {
                    title: "Logo URL",
                    placeholder: "Put the environment logo url"
                },
                privacy: {
                    title: "Do you want to keep it private?"
                },
                roles: {
                    title: "Select your list of roles"
                }
            },
            message: {
                successAdd: "Environment created successfully"
            },
        },
        trigger: {
            title: {
                main: "Function's triggers",
                single: "Function's trigger",
            },
            allTriggers: "All triggers",
            truncate: "Clear all triggers",
            message: {
                successCreation: "Trigger successfuly created",
                successDelete: "Trigger successfuly deleted",
                successMultiDelete: "Triggers successfully deleted",
                successTruncate: "All triggers cleared with success",
                emptyMessage: "No triggers available"
            },
            inputs: {
                name: {
                    title: "Name",
                    placeholder: "Put the trigger's name"
                },
                cronExpr: {
                    title: "Cron expr",
                    placeholder: "Put the triggers's crontab expr"
                }
            },
            table: {
                name: "Name",
                kind: "Kind",
                cronExpr: "Cron expr"
            },
            cronExpr: {
                everyMinute: "Every minute",
                everyHour: "Every hour",
                everyDay: "Every day",
                everyWeek: "Every week",
                everyMonth: "Every month"
            }
        },
        invocation: {
            title: {
                main: "Function's invocations",
                single: "Function's invocation",
            },
            allInvocations: "All invocations",
            truncate: "Clear all invocations",
            message: {
                successDelete: "Invocation successfuly deleted",
                successTruncate: "All invocations cleared with success",
                successInvoked: "Function invoked with success",
                successResultCopy: "Result copied with success",
                noInvocations: "There's no invocations yet",
                errorInvoked: "An error occured while invoking the function",
                inProgress: "In progress",
            },
            table: {
                state: "State",
                result: "Result",
                invoker: "Invoker",
                time: "Invocation time"
            },
            args: {
                placeholder: "Put the arg's value here"
            },
            actions: {
                copyResult: "Copy result",
                rerunInvocation: "Re-run invocation"
            }
        },
        function: {
            title: {
                main: "Serverless functions",
                add: "Create a function",
                overview: "Update function"
            },
            add: "Add a serverless function",
            call: "Call a serverless function",
            import: "Import a serverless function",
            back: "Back to serverless functions",
            state: {
                lowCode: {
                    title: "Low Code"
                }
            },
            is_public: "Public endpoint",
            by: "by",
            inputs: {
                name: {
                    title: "Name",
                    placeholder: "Put the function's name"
                },
                owner: {
                    title: "owner",
                    placeholder: "Put the owner's email"
                },
                language: {
                    title: "Language"
                },
                code: {
                    title: "Code"
                },
                blockly: {
                    title: "Blockly"
                },
                args: {
                    title: "Arguments",
                    placeholder: "Put the arg's name"
                },
                callback_url: {
                    title: "Callback's URL",
                    placeholder: "Put the callback's URL here"
                },
                callback_header: {
                    title: "Callback's header",
                    placeholder: "Put the Authorization header value here"
                },
                regexp: {
                    title: "Regexp validation",
                    placeholder: "Put the regexp for argument's validation here"
                },
                callFunction:{
                    title: "Call a function",
                    placeholder: "Select a function"
                }
            },
            message: {
                successAdd: "Function created successfully",
                successDelete: "Function successfully deleted",
                successMultiDelete: "Functions successfully deleted",
                successUpdate: "Function successfully updated",
                successExport: "Function successfully exported",
                successImport: "Function successfully imported",
                successCopyId: "Function id copied with success",
                errorImport: "An error occured while importing the function",
                emptyMessage: "No functions available",
                createMessage: "Create your first function",
                blocklyWarning: "Beware! Once you click below, you will override your code with code generated from blockly.",
                searchbartip : "Tip: you can filter the functions by their language by writing ':' before the name of the language in the search bar",
                unsavedChangesWarning: "You have unsaved changes, do you want to leave the page?"
            },
            actions: {
                copyFunctionId: "Copy function id",
            },
            table: {
                name: "Name",
                language: "Language"
            }
        },
        cwai: {
            mainTitle: "Cwai chat",
            model: {
                title: "Model",
                placeholder: "Write the model"
            },
            prompt: {
                title: "Your prompt",
                placeholder: "Write your prompt"
            },
            send: "Send",
            answer: "Cwai answer",
            regenerate: "Regenerate response"
        },
        sendEmail: {
            mainTitle: "Send an email",
            from: {
                title: "Expeditor",
                placeholder: "Put the expeditor email"
            },
            to: {
                title: "Recipient",
                placeholder: "Put the recipient email"
            },
            subject: {
                title: "Subject",
                placeholder: "Put the subject"
            },
            content: "Email content",
            templated: "Using the comwork cloud template?",
            success: "Email successfully sent",
            send: "Send"
        },
        environmentOverview: {
            mainTitle: "Update New Environment",
            back: "Back to environments",
            createdAt: "Created at",
            inputs: {
                name: {
                    title: "Name",
                    placeholder: "Put the environment name"
                },
                path: {
                    title: "Path",
                    placeholder: "Put the environment path"
                },
                logo_url: {
                    title: "Logo URL",
                    placeholder: "Put the environment logo url"
                },
                mainRole: {
                    title: "Main role",
                    placeholder: "Choose the environment main role"
                },
                description: {
                    title: "Description",
                    placeholder: "Put the environment description"
                },
                privacy: {
                    title: "Do you want to keep it private?"
                },
                roles: {
                    title: "Modify your list of roles"
                }
            },
            message: {
                successDelete: "Environment successfully deleted",
                successUpdate: "Environment successfully updated"
            }
        },
        addInstance: {
            mainTitle: "Create new instance",
            back: "Back to instances",
            inputs: {
                name: {
                    title: "Choose your instance name",
                    subtitle: "You must enter your project name.",
                    placeholder: "Instance name",
                    hint: "You must enter an instance name"
                },
                type: {
                    title: "Select a Type",
                    subtitle: "Choose your instance type"
                },
                project: {
                    title: "Select your project",
                    subtitle: "Choose your project that will be associeted with this instance"
                },
                addProject: {
                    title: "Add new project"
                },
                dns: {
                    title: "Select the dns zone",
                    subtitle: "Choose the dns zone that will be associeted with this instance"
                },
                environment: {
                    title: "Select your environment",
                    subtitle: "Choose your environment"
                },
                zone: {
                    title: "Choose your availability zone",
                    subtitle: "You must enter your availability zone.",
                    placeholder: "Select a zone"
                }
            },
            message: {
                successAdd: "Instance created successfully"
            }
        },
        attachInstance: {
            mainTitle: "Attach new instance to",
            back: "Back to projects",
            inputs: {
                playbook: {
                    title: "Select your instance",
                    subtitle: "Choose the instance that you want to recreate",
                    project: "Project",
                    instanceName: "Instance Name"
                },
                zone: {
                    title: "Choose your availability zone",
                    subtitle: "You must enter your availability zone.",
                    placeholder: "Select a zone"
                },
                type: {
                    title: "Select a Type",
                    subtitle: "Choose your instance type"
                },
                dns: {
                    title: "Select the dns zone",
                    subtitle: "Choose the dns zone that will be associeted with this instance"
                },
            },
            message: {
                successAdd: "Instance created successfully"
            }
        },
        addRegistry: {
            mainTitle: "Create new registry",
            back: "Back to registries",
            inputs: {
                name: {
                    title: "Choose your registry name",
                    subtitle: "You must enter your project name.",
                    placeholder: "Registry name",
                    hint: "You must enter a registry name"
                },
                type: {
                    title: "Select a Type",
                    subtitle: "Choose your registry type"
                },
                email: {
                    title: "Enter user email address",
                    subtitle: "The email in which the bucket will be affected to.",
                    feedback: "You must enter the owner email.",
                    placeholder: "Email"
                }
            },
            message: {
                successAdd: "Registry created successfully"
            },
            errors: {
                missingEmailInput: "Email is required",
            }
        },
        addBucket: {
            mainTitle: "Create new bucket",
            back: "Back to buckets",
            inputs: {
                name: {
                    title: "Choose your bucket name",
                    subtitle: "You must enter your project name.",
                    placeholder: "Bucket name",
                    hint: "You must enter a bucket name"
                },
                type: {
                    title: "Select a Type",
                    subtitle: "Choose your bucket type"
                },
                email: {
                    title: "Enter user email address",
                    subtitle: "The email in which the bucket will be affected to.",
                    feedback: "You must enter the owner email.",
                    placeholder: "Email"
                }
            },
            message: {
                successAdd: "Bucket created successfully"
            },
            errors: {
                missingEmailInput: "Email is required",
            }
        },
        addProject: {
            mainTitle: "Create new project",
            back: "Back to projects",
            inputs: {
                name: {
                    title: "Choose your project name",
                    subtitle: "You must enter your project name.",
                    placeholder: "Project name"
                },
                email: {
                    title: "Enter user email address",
                    subtitle: "The email in which the instance will be affected to.",
                    feedback: "You must enter the owner email.",
                    placeholder: "Email"
                },
                showOptions: {
                    button: "Show options",
                    title: "Chose your own Gitlab workspace",
                    subtitle: "By opening this section you can customize where you want your project to be created"
                },
                gitlabHost: {
                    title: "Gitlab host",
                    subtitle: "The host of the gitlab server (this must be a URL)",
                    placeholder: "host"
                },
                accessToken: {
                    title: "Access Token",
                    subtitle: "In order to create the project and add required configurations, you have to provide a valid access token of your account (make sure this scopes are activated: api, read_api,read_repository,write_repository)",
                    placeholder: "Access token"
                },
                gitUsername: {
                    title: "Git username",
                    subtitle: "Provide your username registered in the gitlab application",
                    placeholder: "Username"
                },
                namespace: {
                    title: "Namespace",
                    subtitle: "Provide the namespace id (Group ID) in which the project will be created (make sure you have all access to this group)",
                    placeholder: "Group ID"
                },
            },
            message: {
                successAdd: "Project created successfully"
            }
        },
        addUser: {
            mainTitle: "Create new user",
            back: "Back to users",
            inputs: {
                email: {
                    placeholder: "Email"
                },
                password: {
                    placeholder: "Password"
                },
                companyName: {
                    placeholder: "Company name"
                },
                registrationNumber: {
                    placeholder: "Registration number"
                },
                address: {
                    placeholder: "Address"
                },
                contactInformations: {
                    placeholder: "Contact informations"
                },
                access: {
                    title: "Access",
                    adminAccess: "Admin",
                    userAccess: "User"
                },
                disableEmails: {
                    title: "Disable emails"
                }
            },
            errors: {
                missingEmailInput: "Email is required",
                missingPasswordInput: "Password is required"
            },
            message: {
                successAdd: "User successfully added"
            }
        },
        customInvoice: {
            mainTitle: "Custom Invoice",
            back: "Back to invoices",
            inputs: {
                email: {
                    placeholder: "Email"
                },
                date: {
                    placeholder: "Date"
                },
                sendMail: {
                    title: "Send Email",
                },
                items: {
                    title: "Items",
                    label: {
                        placeholder: "Label"
                    },
                    price: {
                        placeholder: "Price"
                    }
                },
            },
            errors: {
                missingInputs: "Fill the whole inputs"
            },
            message: {
                successCustom: "Invoice successfully customized",
                successPreview: "Invoice successfully previewed",
            }
        },
        editionInvoice: {
            mainTitle: "Edit an invoice",
            back: "Back to invoices",
            inputs: {
                reference: {
                    placeholder: "Reference"
                },
                newReference: {
                    placeholder: "New Reference"
                }
            },
            errors: {
                missingInputs: "Fill the whole inputs",
                referenceIsEmpty: "Reference input is empty",
                referenceIsInvalid: "Reference input is invalid",
                emailIsEmpty: "Email is mandatory"
            },
            message: {
                success: "Invoice successfully edited"
            }
        },
        generateInvoice: {
            inputs: {
                email: {
                    placeholder: "Email",
                },
                startDate: {
                    title: "Start date",
                    placeholder: "Start",
                },
                endDate: {
                    title: "End date",
                    placeholder: "End",
                },
            },
            buttons: {
                preview: "Preview",
                send: "Send"

            },
            message: {
                successPreview: "Invoice successfully generated",
                succcesSent: "Invoice successfully generated and sent to client"
            }
        },
        instanceOverview: {
            back: "Back to instances",
            fields: {
                title: "Instance informations",
                status: "Status",
                environment: "Environment",
                type: "Type",
                availabilityZone: "Availability Zone",
                cores: "Cores",
                ram: "RAM",
                disk: "Disk",
                bandwidth: "Bandwidth",
                volumes: "Volumes",
                localStorage: "Local Storage",
                publicIp: "Public IP",
                project: "Project",
                deleteTitle: "Delete Instance",
                warning: "Warning",
                deleteDescription: "This action will delete all your volumes and data located on your storage server. Note that your instance must be powered on or stopped to be deleted."
            },
            buttons: {
                open: "Open instance",
                reboot: "Reboot instance",
                delete: "Delete instance",
                refresh: "Refresh instance",
                refreshInProgress: "Refresh in progress",
                powerOn: "Power on instance",
                powerOff: "Power off instance",
                successRefresh: "Instance state successfully refreshed",
            },
            message: {
                successDelete: "Instance successfully deleted",
                successUpdate: "Instance successfully updated"
            }
        },
        registryOverview: {
            back: "Back to registries",
            labels: {
                registryId: "Registry ID",
                registryEndpoint: "Registry endpoint",
                accessKey: "Access key",
                secretKey: "Secret key",
            },
            fields: {
                title: "Registry informations",
                status: "Status",
                type: "Type",
                region: "Region",
                deleteTitle: "Delete registry",
                transferTitle: "Transfer registry",
                warning: "Warning",
                deleteDescription: "This action will delete all your images on the registry.",
                transferDescription: "This action will transfer all your images on the registry."
            },
            buttons: {
                open: "Open",
                reboot: "Reboot",
                delete: "Delete registry",
                transfer: "Transfer registry",
                refresh: "Refresh"
            },
            message: {
                successDelete: "Registry successfully deleted",
                successUpdate: "Registry successfully updated",
                successRefresh: "Registry successfully refreshed",
            }
        },
        bucketOverview: {
            back: "Back to buckets",
            fields: {
                title: "Bucket informations",
                status: "Status",
                type: "Type",
                region: "Region",
                deleteTitle: "Delete bucket",
                transferTitle: "Transfer bucket",
                warning: "Warning",
                deleteDescription: "This action will delete all your volumes and data located on your bucket.",
                transferDescription: "Transfering the bucket will make it inaccessible in the future."
            },
            buttons: {
                open: "Open",
                reboot: "Reboot",
                delete: "Delete bucket",
                transfer: "Transfer bucket",
                refresh: "Refresh"
            },
            message: {
                successDelete: "Bucket successfully deleted",
                successUpdate: "Bucket successfully updated",
                successRefresh: "Bucket state successfully refreshed",
            }
        },
        contact: {
            title: "Contact",
            inputs: {
                email: "Email",
                subject: "Subject",
                message: "Message"
            },
            message: {
                missingEmail: "Email is missing",
                missingSubject: "Subject is missing",
                missingMessage: "Message is missing",
                success: "Successfully send contact email"
            }
        },
        support: {
            addNewTicket: "Open a new support ticket",
            selectedProduct: "Selected Product",
            selectProduct: "Select Product",
            severityText: "Severity",
            ticketTitle: "Ticket title",
            openedTickets: "Opened",
            closedTickets: "Closed",
            selectSeverity: "Select severity",
            createdBy: "Created by",
            severity: {
                low: 'Low',
                medium: 'Medium',
                high: 'High'
            },
            back: "Back to tickets",
            description: "Description",
            reply: "Reply",
            table: {
                id: "Ticket ID",
                subject: "Title",
                created_at: "Created",
                selected_product: "Product",
                last_update: "Last update",
            },
            awaitCustomer: "Await customer",
            awaitAgent: "Await agent",
            successDelete: "Ticket successfully deleted",
            successMultiDelete: "Tickets successfully deleted",
            updateFromKeyboardTip: "Quick tip: Press Ctrl + Enter to reply directly from the keyboard",
            closed: "Closed"
        },
        adminVouchersPage: {
            title: "Vouchers",
            description: "Below here's a list of your voucher.",
            add: "Add new voucher",
            create: "Create a new voucher",
            learnMore: "Learn more",
            emptyMessage: "There is no voucher for the moment",
            createMessage: "Create your first voucher",
            activeVouchers: "Active vouchers",
            OldVouchers: "Old vouchers",
            warning: "Warning",
            email: "Email",
            table: {
                id: "ID",
                code: "Code",
                user: "User",
                validity: "Validity",
                created: "Created",
                actions: "Actions",
                price: "Price",
                credit: "Credit"
            },
            message: {
                successMultiDelete: "Vouchers successfully deleted",
                successDelete: "Voucher successfully deleted"
            },
            back: "Back to vouchers",
            deleteTitle: "Delete voucher",
            deleteDescription: "This action will delete the voucher and wont be available for future users."
        },
        adminRegistriesPage: {
            title: "Registries",
            description: "Below here's a list of your registries",
            createInstance: "Create a new registry",
            addInstance: "Add new registry",
            learnMore: "Learn more",
            emptyMessage: "There is no registries right now.",
            createMessage: "Create your first registry",
            table: {
                id: "ID",
                name: "Name",
                size: "Size",
                status: "Status",
                created: "Created",
                actions: "Actions"
            },
            message: {
                successMultiDelete: "Registries successfully deleted"
            }
        },
        adminBucketsPage: {
            title: "Buckets",
            description: "Below here's a list of your buckets",
            createInstance: "Create a new bucket",
            addInstance: "Add new bucket",
            learnMore: "Learn more",
            emptyMessage: "There is no buckets right now.",
            createMessage: "Create your first bucket",
            table: {
                id: "ID",
                name: "Name",
                size: "Size",
                status: "Status",
                created: "Created",
                actions: "Actions"
            },
            message: {
                successMultiDelete: "Buckets successfully deleted"
            }
        },
        instancesPage: {
            title: "Instances",
            description: "Below here's a list of your instances. You can poweroff, reboot, stop or delete each instance.",
            createInstance: "Create a new instance",
            addInstance: "Add new instance",
            learnMore: "Learn more",
            emptyMessage: "There is no instances right now.",
            createMessage: "Create your first instance",
            table: {
                id: "ID",
                name: "Name",
                size: "Size",
                status: "Status",
                created: "Created",
                actions: "Actions"
            },
            message: {
                successMultiDelete: "Instances successfully deleted"
            }
        },
        invoicesPage: {
            inputs: {
                email: {
                    title: "Email",
                    placeholder: "Email"
                },
                startDate: {
                    title: "Start date",
                    placeholder: "Start",
                },
                endDate: {
                    title: "End date",
                    placeholder: "End",
                },
            },
            table: {
                id: "ID",
                reference: "Reference",
                date: "Date",
                period: "Periode",
                status: "Status",
                updateStatus: "Update status",
                download: "Download",
                totalPrice: 'Total Price',
                pay: "Pay",
                receipt: "Receipt"
            },
            buttons: {
                search: "Search",
            }
        },
        projectOverview: {
            back: "Back to projects",
            fields: {
                title: "Project informations",
                status: "Status",
                owner: "Owner",
                availabilityZone: "Availability Zone",
                activeInstances: "Active instances",
                numberPlaybooks: "Number of playbooks",
                playbooks: "Playbooks",
                regenerateDeletedInstances: "Regenerate deleted instances",
                instances: {
                    title: "Instances",
                    hint: "This action will make you choose a deleted instance that was attached to this project before and recreate it.",
                    linkName: "Here"
                },
                link: {
                    title: "Link",
                    hint: "Open link"
                },
                localStorage: "Local Storage",
                deleteTitle: "Delete project",
                transferTitle: "Transfer project",
                warning: "Warning",
                emptyInstances: "No active instances are attached to this project.",
                emptyPlaybook: "No playbooks are attached to this project.",
                deleteDescription: "This action will delete your Gitlab project and any changes you made on the project will be lost. Note that this is not reversible.",
                transferDescription: "Transfering the project will make it inaccessible in the future. Note that all the instances under this project will get transfered as well"
            },
            buttons: {
                open: "Open",
                delete: "Delete project",
                transfert: "Transfer",
                attachInstance: "Attach instance",
            },
            message: {
                successDelete: "Project Successfully deleted",
                successMultiDelete: "Projects successfully deleted"
            }
        },
        projectsPage: {
            title: "Projects",
            description: "Below here's a list of your git projects which contains your instances ansible configuration.",
            createProject: "Create a new project",
            addProject: "Add new project",
            learnMore: "Learn more",
            emptyMessage: "There is no projects right now.",
            createMessage: "Create your first project",
            table: {
                id: "ID",
                name: "Name",
                numberOfInstances: "N instances",
                actions: "Actions"
            }
        },
        usersPage: {
            title: "Users",
            createUser: "Create a new user",
            addUser: "Add new user",
            table: {
                id: "ID",
                email: "Email",
                adminAccess: "Admin access",
                confirmation: "Confirmation",
                created: "Created At",
                actions: "Actions"
            },
            message: {
                userIsNotConfirmedYet: "User is not confirmed yet",
                userIsAlreadyConfirmed: "User is already confirmed",
            }
        },
        environmentsPage: {
            title: "Environments",
            createEnvironment: "Create a new environment",
            addEnvironment: "Add new environment",
            importEnvironment: "Import an environment",
            table: {
                id: "ID",
                name: "Name",
                path: "Path",
                private: "Private",
                created: "Created At",
                actions: "Actions"
            }
        },
        userOverview: {
            back: "Back to users",
            fields: {
                id: "ID",
                email: "Email",
                createdAt: "Created at",
            },
            inputs: {
                email: "Email",
                newPassword: {
                    title: "New password",
                    placeholder: "Put a new password",
                },
                confirmPassword: {
                    title: "Confirm password",
                    placeholder: "Confirm your password"
                }
            },
            table: {
                name: "Name",
                size: "Size",
                status: "Status",
                created: "Created At"
            },
            info: {
                instances: {
                    title: "Number of instances",
                    unit: "Instances"
                },
                projects: {
                    title: "Number of projects",
                    unit: "Projects"
                }
            },
            buttons: {
                resetPassword: "Reset Password",
                reboot: "Reboot",
                delete: "Delete Instance"

            },
            message: {
                successDelete: "User successfully deleted",
                successUpdate: "User successfully updated"
            }
        },
        pageNotFound: {
            message: "Page not found",
            description: "The page you are looking for does not exist"
        }

    }
}

export const frenchLanguage = {
    error_codes: {
        "104": "Instance introuvable",
        "101": "Instance mise à jour avec succès",
        "102": "Instance supprimée avec succès",
        "105": "Le type d'instance n'existe pas",
        "106": "L'action n'existe pas",
        "107": "Instance déjà arrêtée",
        "108": "Vous ne pouvez pas arrêter l'instance lors du redémarrage",
        "109": "Vous ne pouvez pas arrêter l'instance au démarrage",
        "110": "Instance déjà en cours d'arrêt",
        "111": "Instance déjà en cours d'exécution",
        "112": "Vous ne pouvez pas démarrer l'instance lors du redémarrage",
        "113": "Instance déjà en cours de démarrage",
        "114": "Vous ne pouvez pas démarrer l'instance pendant l'arrêt",
        "115": "Vous ne pouvez pas redémarrer l'instance lorsqu'elle est arrêtée",
        "116": "L'instance redémarre déjà",
        "117": "Vous ne pouvez pas redémarrer l'instance au démarrage",
        "118": "Vous ne pouvez pas redémarrer l'instance pendant l'arrêt",
        "119": "Instance déjà active",
        "120": "Vous ne pouvez pas supprimer l'instance tant qu'elle n'est pas en cours d'exécution ou arrêtée",
        "121": "Veuillez spécifier le playbook que vous souhaitez joindre",
        "122": "Playbook introuvable",
        "123": "L'instance existe déjà",
        "124": "Type d'instance introuvable dans cette zone",
        "125": "Type d'instance introuvable dans cette région",
        "126": "Vous n'avez pas accès pour provisionner des instances",
        "127": "Instance déjà en cours d'exécution avec ce playbook",
        "204": "Projet introuvable",
        "210": "Projet introuvable dans gitlab",
        "202": "Projet supprimé avec succès",
        "205": "Le projet contient toujours des instances actives",
        "206": "Le projet n'a pas de playbooks",
        "207": "Le nom du projet est manquant",
        "208": "Le projet existe déjà",
        "209": "Quelque chose s'est mal passé lors de la suppression du projet",
        "300": "Utilisateur créé avec succès (un email de confirmation a été envoyé)",
        "301": "Utilisateur mis à jour avec succès",
        "302": "L'utilisateur a été supprimé avec succès",
        "303": "Utilisateur confirmé avec succès",
        "304": "Utilisateur introuvable",
        "305": "L'e-mail existe déjà",
        "306": "L'e-mail de confirmation a été envoyé avec succès",
        "307": "L'utilisateur a été vérifié avec succès",
        "308": "La vérification de l'utilisateur a échoué",
        "309": "L'e-mail de réinitialisation du mot de passe a été envoyé avec succès",
        "310": "L'utilisateur a déjà été confirmé",
        "311": "Mot de passe incorret",
        "312": "Le token de confirmation est obligatoire",
        "313": "Token jwt invalide",
        "314": "Erreur inattendue",
        "400": "Paramètres invalides",
        "401": "Bucket supprimé avec succès",
        "402": "Bucket mis à jour avec succès",
        "404": "Bucket introuvable",
        "405": "Bucket rafraichit avec succès",
        "504": "Le fournisseur n'existe pas",
        "604": "facture introuvable",
        "601": "facture mise à jour avec succès",
        "704": "Consommation introuvable",
        "706": "Impossible de générer la consommation",
        "801": "Environnement mis à jour avec succès",
        "802": "Environnement supprimé avec succès",
        "804": "Environnement introuvable",
        "803": "L'environnement est manquant",
        "805": "Le nom de l'environnement est manquant",
        "806": "Le chemin de l'environnement est manquant",
        "807": "Le rôle principal ne fait pas partie des rôles sélectionnés",
        "808": "Le chemin existe déjà",
        "901": "Registry supprimée avec succès",
        "902": "Registry mise à jour avec succès",
        "904": "Registry introuvable",
        "1001": "Autorisation refusée",
        "1002": "Échec de l'authentification",
        "1003": "Votre compte n'a pas encore été confirmé",
        "1004": "Informations manquantes pour la connexion",
        "1101": "Veuillez fournir le nom du bucket",
        "1102": "Veuillez fournir un e-mail",
        "1103": "Le type de bucket n'existe pas",
        "1104": "La région n'existe pas",
        "1105": "Le stack existe déjà",
        "1106": "Veuillez fournir le nom de l'instance",
        "1107": "Veuillez fournir un identifiant de projet",
        "1108": "Veuillez fournir une zone DNS racine valide",
        "1109": "L'environnement est manquant",
        "1110": "La zone n'existe pas",
        "1111": "Le playbook existe déjà",
        "1112": "Impossible d'envoyer la facture pdf par e-mail",
        "1113": "Impossible de créer un compte utilisateur gitlab",
        "1114": "Runner introuvable",
        "1115": "Impossible de supprimer les runners gitlab",
        "1116": "Impossible de supprimer le projet gitlab",
        "1117": "Image introuvable",
        "1118": "Le nom contient des caractères invalides",
        "1119": "Le nom est trop long",
        "1120": "Hôte Gitlab non disponible",
        "1121": "Un problème survenu lors de la création du projet, vérifiez votre token d'accès",
        "1122": "Veuillez fournir le nom de la registry",
        "1123": "Le type de registry n'existe pas",
        "1201": "Le bon a été mis à jour avec succès",
        "1202": "Le bon a été supprimé avec succès",
        "1204": "Bon non trouvé",
        "1205": "Bon expiré",
        "1206": "Email invalide",
        "1207": "Informations manquantes",
        "1300": "Une méthode de paiement doit être selectionnée par défaut",
        "333333": "Code otp invalide",
        "incomplete_zip": "Votre code postal est incomplet",
        "invalid_expiry_year_past": "L'année d'expiration de votre carte est dans le passé",
        "incomplete_cvc": "Votre code de sécurité de votre carte est incomplet",
        "incomplete_number": "Votre numéro de carte est incomplet",
        "invalid_number": "Votre numéro de carte est invalide",
        "disabled_email_service": "Les emails sont désactivés",
        "not_billable": "L'utilisateur n'est pas facturable",
        "not_emailapi": "L'utilisateur n'a pas l'api email activée",
        "not_cwaiapi": "L'utilisateur n'a pas l'api cwai activée",
        "cwaiapi_not_enabled": "L'API cwai n'est pas activée",
        "cwai_error": "Il y a un problème avec la réponse de l'API cwai",
        "cwai_model_notfound": "Le modèle n'existe pas",
        "payment_method_not_found": "Méthode de paiement non trouvée",
        "not_correct_item": "L'item n'est pas correctement serialisé",
        "bad_date_aaaammdd": "Mauvais format de date (attendu : AAAA/MM/JJ ou AAAA-MM-JJ)",
        "not_valid_email": "L'adresse email n'est pas valide",
        "password_too_short": "Le mot de passe est trop court (au moins 8 caractères requis)",
        "password_no_number": "Le mot de passe doit contenir au moins un chiffre",
        "password_no_upper": "Le mot de passe doit contenir au moins une majuscule",
        "password_no_lower": "Le mot de passe doit contenir au moins une minuscule",
        "password_no_symbol": "Le mot de passe doit contenir au moins un caractère spécial",
        "instance_name_invalid": "Le nom de l'instance est invalid (ne peut contenir que des lettres non accentuées, chiffres et '-')",
        "bad_invoice_ref": "La référence de la facture est incorrect (elle doit contenir au moins 5 chiffres)",
        "user_id_or_email_mandatory": "Il faut obligatoirement préciser l'id de l'utilisateur ou son email",
        "user_not_found": "L'utilisateur n'existe pas", 
        "file_not_found": "Fichier non trouvé",
        "invalid_api_key": "Veuillez fournir un nom approprié pour la clé api",
        "faas_invalid_parameters": "Paramètres invalides",
        "faas_not_found_function": "La fonction n'existe pas",
        "faas_not_found_invocation": "L'invocation n'existe pas",
        "faas_not_found_trigger": "Le déclencheur n'existe pas",
        "faas_language_not_supported": "Langage non supporté",
        "faas_not_write_right": "Vous n'avez pas le droit d'exécuter cette fonction",
        "faas_not_exec_right": "Vous n'avez pas le droit de modifier cette fonction",
        "faas_not_admin": "Vous devez être administrateur pour lire ces ressources",
        "faas_not_granted": "Le module FaaS n'est pas activé pour vous",
        "faas_wrong_args_number": "Le nombre d'argument ne correspond pas pour cette fonction",
        "faas_not_same_args": "Les arguments sont différents dans la définition de la fonction",
        "faas_state_undefined": "L'état est obligatoire",
        "faas_state_not_known": "Etat inconnu",
        "faas_invalid_function_id": "L'id de la fonction est invalide",
        "faas_trigger_kind_not_supported": "Le type de trigger est invalide",
        "cron_expr_invalid": "L'expression cron est invalide",
        "faas_function_name_missing": "Le nom de la fonction est obligatoire",
    },
    common: {
        ok: "OK",
        button: {
            create: "Créer",
            add: "Ajouter",
            delete: "Supprimer",
            update: "Modifier",
            save: "Enregistrer",
            generate: "Générer",
            edition: "Edition",
            return: "Retour",
            send: "Envoyer",
            download: "Télécharger",
            upload: "Uploader",
            showOptions: "Afficher les options",
            copy: "Copier",
            reboot: "Redémarrer",
            delete2Fa: "Désactiver MFA/2FA",
            activate2Fa: "Activer MFA/2FA",
            verifyCode: "Vérifier le code",
            deleteU2f: "Supprimer la clef usb 2FA",
            activateU2f: "Ajouter une clef usb 2FA",
            run: "Exécuter",
            goFullScreen: "Plein écran",
        },
        state: {
            copied: "Copié",
        },
        fields: {
            userEmail: "Email de l'utilisateur",
        },
        word: {
            or: "Ou"
        },
        message: {
            thisFieldIsRequired: "Ce champ est obligatoire",
            pleaseEnterAnEmail: "Veuillez entrer un email",
            copied: "Copié",
            warning: "Attention",
        },
        table: {
            emptyRowsMessage: "Pas de données disponibles"
        },
        service: {
            serviceNotAvailable: "Service non disponible dans la région"
        },
        payment: "Paiement",
        confirm: "Confirmer",
        admin: {
            renewCredentials: "Renouveler"
        }
    },
    navbar: {
        provider: "Fournisseur",
        region: "Région",
        switchMode: "Changer de mode",
        logout: "Se déconnecter",
        language: "Langue",
        settings: "Paramètres",
        credentials: "Sécurité",
        vouchers: "Vouchers",
        billing: "Facturation",
        support: "Support"
    },
    billing: {
        method: "Moyens de paiement",
        add: "Ajouter",
        invoices: "Factures",
        gateway: "Gateway de paiement",
        card: {
            added: "Carte bancaire ajoutée avec succès",
            deleted: "Carte bancaire supprimée avec succès"
        },
        cardInformations: "Informations de la carte",
    },
    iam: {
        apikey: {
            generate: "Générer une clef",
            downloadConfigFile: "Télécharger le fichier de configuration",
            title: "Clefs d'API",
            generated: "Clef générée",
            warning: {
                part1: "ATTENTION. La clef ne sera affichée qu'une seule fois.",
                part2: "Soyez sûr de l'avoir sauvegardée."
            },
            message: {
                successDownloadConfigFile: "Fichier de configuration téléchargé avec succès"
            }
        },
        access: {
            generate: "Générer un accès",
            title: "Accès",
            email: "Email",
            objectType: "Type d'objet"
        }
    },
    password: {
        reset: {
            notsame: "Les mot de passe sont incompatibles",
            input: "Tapez votre mot de passe",
            confirm: "Confirmez votre mot de passe",
            backToLoginQuestion: "Voulez-vous retourner à la page de connexion ?",
            successMessage: "Mot de passe réinitialisé avec succès",
            errorMessage: "Erreur lors de la réinitialisation du mot de passe",
        },
        forgotten: {
            successMessage: "Un lien de ré-initialisation de mot de passe a été envoyé par email",
            notfound: "Aucun compte associé avec cet email",
            inputEmail: "Tapez votre email"
        },
    },
    confirm: {
        messageSent: "L'email de confirmation a été envoyé avec succès",
        inputEmail: "Tapez votre email",
        successMessage: "Utilisateur confirmé avec succès"
    },
    cookies: {
        why: "Ce site web utilise des cookies pour assurer la meilleure expérience utilisateur possible.",
        learnMore: "En savoir plus",
        understand: "Je comprends"
    },
    intro: {
        presentation: "Ceci est la console web de comwork cloud",
        wiki: {
            part1: "Plus de détails sur notre",
            part2: "documentation"
        },
    },
    login: {
        title: "Se connecter",
        instruction: "Entrez votre email et mot de passe",
        email: "Email",
        password: "Mot de passe",
        button: "Se connecter",
        contact: "Contact",
        question: "Vous n'avez pas de compte ?",
        signup: "Inscription",
        forgottenpassword: "Mot de passe oublié",
        goBackToLogin: "Retour à la connexion",
        error: {
            accountNotActivated: "Votre compte n'est pas activé actuellement. Contactez un administrateur en utilisant cet e-mail: "
        }
    },
    setup2fa: {
        title: "Configurer l'authentification 2FA/MFA",
        scan: "Scanner le QR code",
        verificationCode: "Code de vérification",
        success: "Authentification à deux facteurs activée",
        key: "Clef",
        account: "Compte",
        cantScan: "Vous ne pouvez pas scanner le code?",
        addManualDescription: "Pour ajouter l'entrée manuellement, fournissez les détails suivants à l'application sur votre téléphone.",
        verificationCodePlacehold: "Tapez le code de vérification à 6 chiffres",
        instruction: {
            part1: "Suivez",
            part2: "Cette procédure",
            part3: "Pour que vous puissez activer votre MFA"
        },
        error: "Mot de passe incorrect, veuillez réessayer.",
        usbPress: "Branchez votre device USB et appuyez sur le bouton",
        withapp: "Utiliser une app 2FA"
    },
    multiFactorAuth: {
        title: "Authentification multifacteur",
        description: "Entrez le code de l'application à deux facteurs sur votre appareil mobile. Si vous avez perdu votre appareil, vous pouvez saisir l'un de vos codes de récupération.",
        verificationCode: "Code de vérification",
        verificationCodePlacehold: "Tapez le code de vérification à 6 chiffres",
        error: "Code incorrect, veuillez réessayer.",
        unauthorized: "Vous n'êtes pas connectés, veuillez vous authentifier à nouveau",
    },
    signup: {
        title: "S'inscrire",
        instruction: {
            part1: "Suivez",
            part2: "Cette procédure",
            part3: "Pour que nous puissions prendre en compte votre inscription."
        },
        email: "Email *",
        acceptTerms: "Accepter les",
        terms: "Conditions d'utilisations",
        company: "Nom de l'entreprise",
        registrationNumber: "Matricule",
        address: "Adresse",
        contactInformations: "Informations de contact",
        password: "Mot de passe *",
        passwordConfirmation: "Confirmez votre mot de passe *",
        button: "S'inscrire",
        question: "Vous avez déjà un compte ?",
        login: "Se connecter",
        error: {
            passwordsNotMatch: "Les mots de passe ne correspondent pas",
            passwordsNotFound: "Veuillez renseigner et confirmer votre mot de passe",
            emailNotFound: "Veuillez renseigner votre e-mail",
            acceptTerms: "Vous devez accepter les conditions d'utilisations pour poursuivre l'inscription"
        }
    },
    sidebar: {
        dashboard: "Tableau de bord",
        projects: "Projets",
        instances: "Instances",
        invoices: "Factures",
        buckets: "Buckets",
        registries: "OCI registries",
        manageEmails: {
            title: "Emails"
        },
        cwai: "Cwai Chat",
        functions: {
            title: "Serverless",
            overview: "Aperçu",
            add: "Ajouter"
        },
        invocations: {
            overview: "Invocations"
        },
        triggers: {
            overview: "Déclencheurs"
        },
        manageUsers: {
            title: "Utilisateurs",
            overview: "Aperçu",
            add: "Ajouter"
        },
        manageEnvironments: {
            title: "Environnements",
            overview: "Aperçu",
            add: "Ajouter"
        },
        manageSupport: {
            title: "Gérer les tickets",
        },
        manageInstances: {
            title: "Gérer les instances",
            overview: "Aperçu",
            add: "Ajouter"
        },
        manageFunctions: {
            title: "Serverless",
        },
        manageVouchers: {
            title: "Gérer les vouchers",
            overview: "Aperçu",
            add: "Ajouter"
        },
        manageProjects: {
            title: "Gérer les projets",
            overview: "Aperçu",
            add: "Ajouter"
        },
        manageInvoices: {
            title: "Gérer les factures",
            overview: "Aperçu",
            custom: "Personnalisé",
            generate: "Générer",
            edition: "Editer"
        },
        manageBuckets: {
            title: "Gérer les buckets",
            overview: "Aperçu",
            add: "Ajouter"
        },
        manageRegistries: {
            title: "Gérer les registries",
            overview: "Aperçu",
            add: "Ajouter"
        }
    },
    dashboard: {
        settings: {
            userInformations: "Informations utilisateur",
            passwordManagement: "Gestion des mots de passe",
            input: {
                email: "E-mail",
                address: "Adresse",
                companyName: "Nom de l'entreprise",
                registrationNumber: "Numéro d'enregistrement",
                contactInformations: "Coordonnées",
                oldPassword: "Ancien mot de passe",
                newPassword: "Nouveau mot de passe",
                confirmPassword: "Confirmer le mot de passe",
            },
            security: "Sécurité",
            messages: {
                successDelete2Fa: "L'authentification 2Factor a été supprimée avec succès",
            }
        },
        modal: {
            powerModal: {
                title: "%(status)s instance",
                message: "Êtes-vous sûr de vouloir %(status)s votre instance",
                button: "%(status)s"
            },
            rebootModal: {
                title: "Redémarrer votre instance",
                message: "Êtes-vous sûr de vouloir redémarrer votre instance",
                button: "Redémarrer"
            },
            delete: {
                resource: "Êtes-vous sûr de vouloir supprimer votre",
                all: "Êtes-vous sûr de vouloir supprimer toutes les ressources sélectionnées ?"
            }
        },
        table: {
            id: "Id",
            createdAt: "Créé(e) le",
            updatedAt: "Modifié(e) le",
            actions: "Actions",
            filter: "Filtrer",
            run: "Lancer",
            schedule: "Programmer",
            function: "Fonction",
            args: "Arguments",
            owner: "Propriétaire"
        },
        userDashboard: {
            resourceOverview: {
                title: "Aperçu des ressources",
                projects: "Projets",
                instances: "Instances",
                buckets: "Buckets",
                registries: "Registries"
            },
            availableEnvironments: {
                title: "Environnements disponibles"
            },
            consumptions: {
                title: "Consommation",
                currentConsumptions: "Consommation mois en cours",
                unpayedConsumptions: "Consommations non payées"
            }
        },
        addEnvironement: {
            mainTitle: "Créer un nouvel environnement",
            back: "Retour aux environnements",
            inputs: {
                template: {
                    title: "Template de l'environnement"
                },
                documentation: {
                    title: "Documentation"
                },
                name: {
                    title: "Nom",
                    placeholder: "Mettre le nom de l'environnement"
                },
                path: {
                    title: "Chemin",
                    placeholder: "Mettre le chemin de l'environnement"
                },
                subdomains: {
                    title: "Sous domaines",
                    placeholder: "Mettre un sous domaine"
                },
                mainRole: {
                    title: "Rôle principal",
                    placeholder: "Choisir le rôle principal de l'environnement"
                },
                description: {
                    title: "Description",
                    placeholder: "Mettre la description de l'environnement"
                },
                logo_url: {
                    title: "Logo URL",
                    placeholder: "Mettre le logo de l'environnement"
                },
                privacy: {
                    title: "Voulez-vous le garder privé?"
                },
                roles: {
                    title: "Sélectionnez votre liste de rôles"
                }
            },
            message: {
                successAdd: "Environnement créé avec succès"
            }
        },
        trigger: {
            title: {
                main: "Déclencheurs de fonctions",
                single: "Déclencheur de fonction",
            },
            allTriggers: "Tous les triggers",
            truncate: "Supprimer tous les triggers",
            message: {
                successCreation: "Trigger crée avec succès",
                successDelete: "Trigger supprimé avec succès",
                successMultiDelete: "Triggers supprimés avec succès",
                successTruncate: "Triggers supprimées avec succès",
                emptyMessage: "Aucun trigger disponible"
            },
            inputs: {
                name: {
                    title: "Nom",
                    placeholder: "Mettre le nom du trigger"
                },
                cronExpr: {
                    title: "Cron expr",
                    placeholder: "Mettre l'expression crontab"
                }
            },
            table: {
                name: "Nom",
                kind: "Type",
                cronExpr: "Cron expr"
            },
            cronExpr: {
                everyMinute: "Chaque minute" ,
                everyHour: "Chaque heure",
                everyDay: "Chaque jour",
                everyWeek: "Chaque semaine",
                everyMonth: "Chaque mois"
            }
        },
        invocation: {
            title: {
                main: "Invocations de fonctions",
                single: "Invocation de fonction"
            },
            allInvocations: "Toutes les invocations",
            truncate: "Supprimer toutes les invocations",
            message: {
                successDelete: "Invocation supprimée avec succès",
                successTruncate: "Invocations supprimées avec succès",
                successInvoked: "Fonction invoquée avec succès",
                successResultCopy: "Résultat copié avec succès",
                noInvocations: "Pas encore d'invocations",
                errorInvoked: "Erreur lors de l'invocation de la fonction",
                inProgress: "En cours",
            },
            table: {
                state: "Etat",
                result: "Résultat",
                invoker: "Invocateur",
                time: "Temps de l'invocation"
            },
            args: {
                placeholder: "Mettre la valeur de l'argument ici"
            },
            actions: {
                copyResult: "Copier le résultat",
                rerunInvocation: "Relancer l'invocation"
            }
        },
        function: {
            title: {
                main: "Fonctions serverless",
                add: "Créer une fonction",
                overview: "Modifier une fonction"
            },
            add: "Ajouter une fonction",
            call: "Appeler une fonction",
            import: "Importer une fonction",
            back: "Retour aux fonctions",
            state: {
                lowCode: {
                    title: "Low Code"
                }
            },
            is_public: "Endpoint publique",
            by: "par",
            inputs: {
                name: {
                    title: "Nom",
                    placeholder: "Mettre le nom de la fonction"
                },
                owner: {
                    title: "Owner",
                    placeholder: "Mettre l'email du propriétaire"
                },
                language: {
                    title: "Langage"
                },
                code: {
                    title: "Code"
                },
                blockly: {
                    title: "Blockly"
                },
                args: {
                    title: "Arguments",
                    placeholder: "Mettre le nom de l'argument"
                },
                callback_url: {
                    title: "Callback URL",
                    placeholder: "Mettre l'URL de la callback"
                },
                callback_header: {
                    title: "Callback header",
                    placeholder: "Mettre la valeur du header Authorization"
                },
                regexp: {
                    title: "Regexp validation",
                    placeholder: "Mettre l'expression régulière de validation"
                },
                callFunction: {
                    title: "Appeler une fonction",
                    placeholder: "Selectionner la fonction à appeler"
                }
            },
            message: {
                successAdd: "Fonction créée avec succès",
                successUpdate: "Fonction mise à jour avec succès",
                successDelete: "Fonction supprimée avec succès",
                successMultiDelete: "Fonctions supprimées avec succès",
                successExport: "Fonction exportée avec succès",
                successImport: "Fonction importée avec succès",
                errorImport: "Erreur lors de l'import de la fonction",
                successCopyId: "Id de la fonction copié avec succès",
                emptyMessage: "Aucune fonction disponible",
                createMessage: "Créer une fonction",
                blocklyWarning: "Attention ! Une fois que vous aurez cliqué ci-dessous, vous remplacerez votre code par le code généré par blockly.",
                searchbartip: "Astuce : vous pouvez filtrer les fonctions par leur langage de programmation en écrivant ':' devant le nom de la langue dans la barre de recherche",
                unsavedChangesWarning: "Attention ! Vous avez des modifications non sauvegardées. Si vous continuez, vous perdrez ces modifications."
            },
            actions: {
                copyFunctionId: "Copier l'id de la fonction",
            },
            table: {
                name: "Nom",
                language: "Langage"
            }
        },
        cwai: {
            mainTitle: "Cwai chat",
            model: {
                title: "Modèle",
                placeholder: "Entrez le modèle"
            },
            prompt: {
                title: "Votre prompt",
                placeholder: "Entrez votre prompt"
            },
            send: "Envoyer",
            answer: "Réponse Cwai",
            regenerate: "Regénérer la réponse"
        },
        sendEmail: {
            mainTitle: "Envoyer un mail",
            from: {
                title: "Expéditeur",
                placeholder: "Adresse de l'expéditeur"
            },
            to: {
                title: "Destinataire",
                placeholder: "Adresse du destinataire"
            },
            subject: {
                title: "Sujet",
                placeholder: "Mettre le sujet"
            },
            content: "Contenu html",
            templated: "Utiliser le template de comwork cloud ?",
            success: "L'email a bien été envoyé",
            send: "Envoyer"
        },
        environmentOverview: {
            mainTitle: "Mettre à jour le nouvel environnement",
            back: "Retour aux environnements",
            createdAt: "Créé à",
            inputs: {
                name: {
                    title: "Nom",
                    placeholder: "Mettre le nom de l'environnement"
                },
                path: {
                    title: "Chemin",
                    placeholder: "Mettre le chemin de l'environnement"
                },
                logo_url: {
                    title: "Logo URL",
                    placeholder: "Mettre le logo url de l'environnement"
                },
                mainRole: {
                    title: "Rôle principal",
                    placeholder: "Choisir le rôle principal de l'environnement"
                },
                description: {
                    title: "Description",
                    placeholder: "Mettre le nom de l'environnement"
                },
                privacy: {
                    title: "Voulez-vous le garder privé?"
                },
                roles: {
                    title: "Modifiez votre liste de rôles"
                }
            },
            message: {
                successUpdate: "Environnement mis à jour avec succès",
                successDelete: "Environnement supprimé avec succès"
            }
        },
        addInstance: {
            mainTitle: "Créer une nouvelle instance",
            back: "Retour aux instances",
            inputs: {
                name: {
                    title: "Choisissez le nom de votre instance",
                    subtitle: "Vous devez saisir le nom de votre projet.",
                    placeholder: "Nom de l'instance",
                    hint: "Vous devez saisir un nom d'instance"
                },
                type: {
                    title: "Sélectionnez un type",
                    subtitle: "Choisissez votre type d'instance"
                },
                project: {
                    title: "Sélectionnez votre projet",
                    subtitle: "Choisissez votre projet qui sera associé à cette instance"
                },
                addProject: {
                    title: "Ajouter un nouveau projet"
                },
                dns: {
                    title: "Sélectionner la zone dns",
                    subtitle: "Choisissez la zone DNS qui sera associée à cette instance"
                },
                environment: {
                    title: "Sélectionnez votre environnement",
                    subtitle: "Choisissez votre environnement"
                },
                zone: {
                    title: "Choisissez votre zone de disponibilité",
                    subtitle: "Vous devez saisir votre zone de disponibilité.",
                    placeholder: "Select a zone"
                }
            },
            message: {
                successAdd: "Instance créée avec succès"
            }
        },
        attachInstance: {
            mainTitle: "Attacher une nouvelle instance à",
            back: "Retour aux projets",
            inputs: {
                playbook: {
                    title: "Sélectionnez votre instance",
                    subtitle: "Choisissez l'instance que vous souhaitez recréer",
                    project: "Projet",
                    instanceName: "Nom de l'instance"
                },
                zone: {
                    title: "Choisissez votre zone de disponibilité",
                    subtitle: "Vous devez saisir votre zone de disponibilité.",
                    placeholder: "Select a zone"
                },
                type: {
                    title: "Sélectionnez un type",
                    subtitle: "Choisissez votre type d'instance"
                },
            },
            message: {
                successAdd: "Instance créée avec succès"
            }
        },
        addRegistry: {
            mainTitle: "Créer une nouvelle registry",
            back: "Retour aux regitries",
            inputs: {
                name: {
                    title: "Choisissez le nom de votre registry",
                    subtitle: "Vous devez saisir le nom de votre projet.",
                    placeholder: "Nom de la registry",
                    hint: "Vous devez saisir un nom de registry"
                },
                type: {
                    title: "Sélectionnez un type",
                    subtitle: "Choisissez votre type du registry"
                },
                email: {
                    title: "Entrez l'adresse e-mail de l'utilisateur",
                    subtitle: "L'e-mail auquel l'bucket sera affectée.",
                    feedback: "Vous devez saisir l'adresse e-mail du propriétaire.",
                    placeholder: "E-mail"
                }
            }, message: {
                successAdd: "Registry créée avec succès"
            },
            errors: {
                missingEmailInput: "Email is requise",
            }
        },
        addBucket: {
            mainTitle: "Créer une nouvelle bucket",
            back: "Retour aux buckets",
            inputs: {
                name: {
                    title: "Choisissez le nom de votre bucket",
                    subtitle: "Vous devez saisir le nom de votre projet.",
                    placeholder: "Nom du bucket",
                    hint: "Vous devez saisir un nom de bucket",
                },
                type: {
                    title: "Sélectionnez un type",
                    subtitle: "Choisissez votre type d'bucket"
                },
                email: {
                    title: "Entrez l'adresse e-mail de l'utilisateur",
                    subtitle: "L'e-mail auquel l'bucket sera affectée.",
                    feedback: "Vous devez saisir l'adresse e-mail du propriétaire.",
                    placeholder: "E-mail"
                }
            }, message: {
                successAdd: "Bucket créée avec succès",
            },
            errors: {
                missingEmailInput: "Email est requis",
            }
        },
        addProject: {
            mainTitle: "Créer un nouveau projet",
            back: "Retour aux projects",
            inputs: {
                name: {
                    title: "Choisissez le nom de votre projet",
                    subtitle: "Vous devez saisir le nom de votre projet.",
                    placeholder: "Nom du projet"
                },
                email: {
                    title: "Entrez l'adresse e-mail de l'utilisateur",
                    subtitle: "L'e-mail auquel l'instance sera affectée.",
                    feedback: "Vous devez saisir l'adresse e-mail du propriétaire.",
                    placeholder: "E-mail"
                },
                showOptions: {
                    bouton: "Afficher les options",
                    title: "Choisissez votre propre espace de travail Gitlab",
                    subtitle: "En ouvrant cette section, vous pouvez personnaliser l'endroit où vous souhaitez que votre projet soit créé"
                },
                gitlabHost: {
                    title: "Hébergeur Gitlab",
                    subtitle: "L'hôte du serveur gitlab (Cela doit être une URL)",
                    placeholder: "hôte"
                },
                accessToken: {
                    title: "Token d'accès",
                    subtitle: "Afin de créer le projet et d'ajouter les configurations requises, vous devez fournir un token d'accès valide de votre compte (assurez-vous que ces portées sont activées: api, read_api,read_repository,write_repository)",
                    placeholder: "Token d'accès"
                },
                gitUsername: {
                    title: "Nom d'utilisateur Git",
                    subtitle: "Fournissez votre nom d'utilisateur enregistré dans l'application gitlab",
                    placeholder: "Nom d'utilisateur"
                },
                namespace: {
                    title: "Espace de noms",
                    subtitle: "Fournissez l'identifiant de l'espace de noms (ID de groupe) dans lequel le projet sera créé (assurez-vous que vous avez tous accès à ce groupe)",
                    placeholder: "ID de groupe"
                },
            },
            message: {
                successAdd: "Projet créé avec succès"
            }
        },
        addUser: {
            mainTitle: "Créer un nouvel utilisateur",
            back: "Retour aux utilisateurs",
            inputs: {
                email: {
                    placeholder: "E-mail"
                },
                password: {
                    placeholder: "Mot de passe"
                },
                companyName: {
                    placeholder: "Nom de l'entreprise"
                },
                registrationNumber: {
                    placeholder: "Numéro d'enregistrement"
                },
                address: {
                    placeholder: "Adresse"
                },
                contactInformations: {
                    placeholder: "Coordonnées"
                },
                access: {
                    title: "Accès",
                    adminAccess: "Admin",
                    userAccess: "Utilisateur"
                },
                disableEmails: {
                    title: "Désactiver les emails"
                }
            },
            errors: {
                missingEmailInput: "Email est requis",
                missingPasswordInput: "Mot de passe requis"
            },
            message: {
                successAdd: "Utilisateur ajouté avec succès"
            }
        },
        customInvoice: {
            mainTitle: "Personalisé votre facture",
            back: "Retour aux factures",
            inputs: {
                email: {
                    placeholder: "Email"
                },
                date: {
                    placeholder: "Date"
                },
                sendMail: {
                    title: "Envoyer par e-mail",
                },
                items: {
                    title: "Articles",
                    items: {
                        title: "Items",
                        label: {
                            placeholder: "Label"
                        },
                        price: {
                            placeholder: "Prix"
                        }
                    },
                }
            },
            errors: {
                missingInputs: "Remplir toutes les entrées"
            },
            message: {
                successCustom: "La facture a été générée avec succès",
                successPreview: "La facture a été prévisualisée avec succès",
            }
        },
        editionInvoice: {
            mainTitle: "Ré-édition de la facture",
            back: "Retour aux factures",
            inputs: {
                reference: {
                    placeholder: "Référence"
                },
                newRefrence: {
                    placeholder: "Nouvelle référence"
                }
            },
            errors: {
                missingInputs: "Remplir toutes les entrées",
                referenceIsEmpty: "L'entrée de référence est vide",
                referenceIsInvalid: "L'entrée de référence n'est pas valide",
                emailIsEmpty: "L'email est obligatoire"
            },
            message: {
                success: "La facture a été éditée avec succès"
            }
        },
        generateInvoice: {
            inputs: {
                email: {
                    placeholder: "E-mail",
                },
                startDate: {
                    title: "Date de début",
                    placeholder: "début",
                },
                endDate: {
                    title: "Date de fin",
                    placeholder: "fin",
                },
            },
            buttons: {
                preview: "Aperçu",
                send: "Envoyer"

            },
            message: {
                successPreview: "La facture a été générée avec succès",
                succcesSent: "La facture a été générée avec succès et envoyée au client"
            }
        },
        instanceOverview: {
            back: "Retour aux instances",
            fields: {
                title: "Informations sur l'instance",
                status: "Statut",
                environment: "Environnement",
                type: "Type",
                availabilityZone: "Zone de disponibilité",
                cores: "Cœurs",
                ram: "RAM",
                disk: "Disque",
                bandwidth: "Bande passante",
                volumes: "Volumes",
                localStorage: "Stockage local",
                publicIp: "IP publique",
                project: "Projet",
                deleteTitle: "Supprimer l'instance",
                warning: "Avertissement",
                deleteDescription: "Cette action supprimera tous vos volumes et données situés sur votre serveur de stockage. Notez que votre instance doit être sous tension ou arrêtée pour être supprimée."
            },
            buttons: {
                open: "Ouvrir l'instance",
                reboot: "Redémarrer l'instance",
                delete: "Supprimer l'instance",
                refresh: "Rafraîchir l'instance",
                refreshInProgress: "Rafraîchissement en cours",
                powerOn: "Allumer l'instance",
                powerOff: "Éteindre l'instance",
            },
            message: {
                successDelete: "Instance supprimée avec succès",
                successUpdate: "Instance mise à jour avec succès",
                successRefresh: "Etat de l'instance est rafraichi avec succès"
            }
        },
        registryOverview: {
            back: "Retour aux registries",
            labels: {
                registryId: "Id de registre",
                registryEndpoint: "Endpoint de registre",
                accessKey: "Clé d'accès",
                secretKey: "Clé secrète",
            },
            fields: {
                title: "Informations sur la registry",
                status: "Statut",
                type: "Type",
                region: "Région",
                deleteTitle: "Supprimer la registry",
                transferTitle: "Transférer la registry",
                warning: "Avertissement",
                deleteDescription: "Cette action supprimera tous vos images sur la registry.",
                transferDescription: "Cette action transférera tous vos images sur la registry."
            },
            buttons: {
                open: "Ouvrir",
                reboot: "Redémarrer",
                delete: "Supprimer la registry",
                transfer: "Transférer la registry",
                refresh: "Rafraîchir"
            },
            message: {
                successDelete: "Registry supprimée avec succès",
                successUpdate: "Registry mise à jour avec succès"
            }
        },
        bucketOverview: {
            back: "Retour aux buckets",
            fields: {
                title: "Informations sur le bucket",
                status: "Statut",
                type: "Type",
                region: "Région",
                deleteTitle: "Supprimer le bucket",
                transferTitle: "Transférer le bucket",
                warning: "Avertissement",
                deleteDescription: "Cette action supprimera tous vos volumes et données situés sur votre bucket.",
                transferDescription: "Le transfert du bucket le rendra inaccessible à l'avenir."
            },
            buttons: {
                open: "Ouvrir",
                reboot: "Redémarrer",
                delete: "Supprimer le bucket",
                transfer: "Transférer le bucket",
                refresh: "Rafraîchir"
            },
            message: {
                successDelete: "Bucket supprimée avec succès",
                successUpdate: "Bucket mise à jour avec succès",
                successRefresh: "Etat de bucket est rafraichi avec succès"
            }
        },
        contact: {
            title: "Contact",
            inputs: {
                email: "Email",
                subject: "Sujet",
                message: "Message"
            },
            message: {
                missingEmail: "L'email est manquant",
                missingSubject: "Le sujet est manquant",
                missingMessage: "Le message est manquant",
                success: "Email de contact envoyer avec succès"
            }
        },
        support: {
            addNewTicket: "Ouvrir un nouveau ticket d'assistance",
            selectedProduct: "Produit sélectionné",
            selectProduct: "Sélectionner un produit",
            severityText: "Gravité",
            ticketTitle: "Titre du ticket",
            openedTickets: "Ouverts",
            closedTickets: "Fermés",
            createdBy: "Créé par",
            selectSeverity: "Sélectionner la gravité",
            severity: {
                low: 'Bas',
                medium: 'Moyen',
                high: 'Elevé'
            },
            back: "Retour aux tickets",
            description: "Description",
            reply: "Répondre",
            table: {
                id: "Ticket ID",
                subject: "Titre",
                created_at: "Crée",
                selected_product: "Produit",
                last_update: "Dernière modification",
            },
            successDelete: "Ticket supprimées avec succès",
            successMultiDelete: "Tickets supprimées avec succès",
            updateFromKeyboardTip: "Astuce : appuyez sur Ctrl + Entrée pour répondre directement à partir du clavier",
            awaitCustomer: "Attente du client",
            awaitAgent: "Attente de l'agent",
            closed: "fermé"
        },
        adminVouchersPage: {
            title: "Vouchers",
            description: "Ci-dessous, voici une liste de vos vouchers.",
            add: "Ajouter un nouveau voucher",
            create: "Créer un nouveau voucher",
            learnMore: "En savoir plus",
            emptyMessage: "Il n'y a pas de bons pour le moment.",
            createMessage: "Créez votre premier voucher",
            activeVouchers: "Actifs",
            OldVouchers: "Anciens",
            warning: "Avertissement",
            email: "E-mail",
            table: {
                id: "ID",
                code: "Code",
                user: "User",
                validity: "Validité",
                created: "Crée",
                actions: "Actions",
                price: "Prix",
                credit: "Crédit"
            },
            message: {
                successMultiDelete: "Vouchers supprimées avec succès",
                successDelete: "Voucher supprimées avec succès"
            },
            back: "Retour aux vouchers",
            deleteTitle: "Supprimer le voucher",
            deleteDescription: "Cette action supprimera le voucher qui ne sera pas disponible pour les utilisateurs.",
        },
        adminRegistriesPage: {
            title: "OCI registries",
            description: "Ci-dessous, voici une liste de vos registries.",
            createInstance: "Créer une nouvelle registry",
            addInstance: "Ajouter une nouvelle registry",
            learnMore: "En savoir plus",
            emptyMessage: "Il n'y a pas de registry pour le moment.",
            createMessage: "Créez votre premier registry",
            table: {
                id: "ID",
                name: "Nom",
                size: "Taille",
                status: "État",
                created: "Créé",
                actions: "Actions"
            },
            message: {
                successMultiDelete: "Registries supprimées avec succès"
            }
        },
        adminBucketsPage: {
            title: "Buckets",
            description: "Ci-dessous, voici une liste de vos buckets.",
            createInstance: "Créer un nouveau bucket",
            addInstance: "Ajouter un nouveau bucket",
            learnMore: "En savoir plus",
            emptyMessage: "Il n'y a pas de buckets pour le moment.",
            createMessage: "Créez votre premier bucket",
            table: {
                id: "ID",
                name: "Nom",
                size: "Taille",
                status: "État",
                created: "Créé",
                actions: "Actions"
            },
            message: {
                successMultiDelete: "Buckets supprimés avec succès"
            }
        },
        instancesPage: {
            title: "Instances",
            description: "Ci-dessous, voici une liste de vos instances. Vous pouvez éteindre, redémarrer, arrêter ou supprimer chaque instance.",
            createInstance: "Créer une nouvelle instance",
            addInstance: "Ajouter une nouvelle instance",
            learnMore: "En savoir plus",
            emptyMessage: "Il n'y a pas d'instance pour le moment.",
            createMessage: "Créez votre premiere instance",
            table: {
                id: "ID",
                name: "Nom",
                size: "Taille",
                status: "État",
                created: "Créé",
                actions: "Actions"
            },
            message: {
                successMultiDelete: "Instances supprimées avec succès"
            }
        },
        invoicesPage: {
            inputs: {
                email: {
                    title: "E-mail",
                    placeholder: "E-mail"
                },
                startDate: {
                    title: "Date de début",
                    placeholder: "début",
                },
                endDate: {
                    title: "Date de fin",
                    placeholder: "fin",
                },
            },
            table: {
                id: "ID",
                reference: "Référence",
                date: "Date",
                period: "Période",
                status: "État",
                updateStatus: "Mettre à jour le status",
                totalPrice: 'Prix Total',
                pay: "Payé",
                download: "Télécharger",
                receipt: "Reçu"
            }
        },
        projectOverview: {
            back: "Retour aux projets",
            fields: {
                title: "Informations sur le projet",
                status: "Statut",
                owner: "Propriétaire",
                availabilityZone: "Zone de disponibilité",
                activeInstances: "Instances actives",
                numberPlaybooks: "Nombre de playbooks",
                playbooks: "Playbooks",
                regenerateDeletedInstances: "Régénérer les instances supprimées",
                instances: {
                    title: "Instances",
                    hint: "Cette action vous permet de choisir une instance supprimée qui était attachée à ce projet auparavant et de la recréer.",
                    linkName: "Ici"
                },
                link: {
                    title: "Lien",
                    hint: "Ouvrir le lien"
                },
                localStorage: "Stockage local",
                deleteTitle: "Supprimer le projet",
                transferTitle: "Transférer le projet",
                warning: "Avertissement",
                emptyInstances: "Aucune instance active n'est attachée à ce projet.",
                emptyPlaybooks: "Aucun playbook n'est attaché à ce projet.",
                deleteDescription: "Cette action supprimera votre projet Gitlab et toutes les modifications que vous avez apportées au projet seront perdues. Notez que ce n'est pas réversible.",
                transferDescription: "Le transfert du projet le rendra inaccessible à l'avenir. Notez que toutes les instances de ce projet seront également transférées"
            },
            buttons: {
                open: "Ouvrir",
                delete: "Supprimer le projet",
                transfert: "Transférer",
                attachInstance: "Attacher une instance",
            },
            message: {
                successDelete: "Projet supprimé avec succès",
                successMultiDelete: "Projets supprimés avec succès",
            }
        },
        projectsPage: {
            title: "Projets",
            description: "Ci-dessous, voici une liste de vos projets git qui contiennent la configuration ansible de vos instances.",
            createProject: "Créer un nouveau projet",
            addProject: "Ajouter un nouveau projet",
            learnMore: "En savoir plus",
            emptyMessage: "Il n'y a pas de projet pour le moment.",
            createMessage: "Créez votre premier projet",
            table: {
                id: "ID",
                name: "Nom",
                numberOfInstances: "N instances",
                actions: "Actions"
            }
        },
        usersPage: {
            title: "Utilisateurs",
            createUser: "Créer un nouvel utilisateur",
            addUser: "Ajouter un nouvel utilisateur",
            table: {
                id: "ID",
                email: "E-mail",
                adminAccess: "Accès administrateur",
                confirmation: "Confirmation",
                created: "Créé à",
                actions: "Actions"
            },
            message: {
                userIsNotConfirmedYet: "L'utilisateur n'est pas encore confirmé",
                userIsAlreadyConfirmed: "L'utilisateur est déjà confirmé",
            }
        },
        environmentsPage: {
            title: "Environnements",
            createEnvironment: "Créer un nouvel environnement",
            addEnvironment: "Ajouter un nouvel environnement",
            importEnvironment: "Importer un environnement",
            table: {
                id: "ID",
                name: "Nom",
                path: "Chemin",
                private: "Privé",
                created: "Créé à",
                actions: "Actions"
            }
        },
        userOverview: {
            back: "Retour aux utilisateurs",
            fields: {
                id: "ID",
                email: "E-mail",
                createdAt: "Créé à",
            },
            inputs: {
                email: "E-mail",
                newPassword: {
                    title: "Nouveau mot de passe",
                    placeholder: "Mettez un nouveau mot de passe",
                },
                confirmPassword: {
                    title: "Confirmer le mot de passe",
                    placeholder: "Confirmez votre mot de passe"
                }
            },
            table: {
                name: "Nom",
                size: "Taille",
                status: "État",
                created: "Créé à"
            },
            info: {
                instances: {
                    title: "Nombre d'instances",
                    unit: "Instances"
                },
                projects: {
                    title: "Nombre de projets",
                    unit: "Projets"
                }
            },
            buttons: {
                resetPassword: "Réinitialiser le mot de passe",
                redémarrage: "Redémarrer",
                delete: "Supprimer l'instance"

            },
            message: {
                successDelete: "L'utilisateur a été supprimé avec succès",
                successUpdate: "L'utilisateur a été mis à jour avec succès"
            }
        },
        pageNotFound: {
            message: "Page introuvable",
            description: "La page que vous recherchez n'existe pas"
        }
    }
}
