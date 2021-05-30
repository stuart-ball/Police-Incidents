﻿import * as React from "react";
import { Flex, Text, Button, Breadcrumb, ChevronEndIcon, Input, Divider, TextArea } from "@fluentui/react-northstar";
import { useTranslation } from "react-i18next";
import { useStyles } from "./newIncidentPage.styles";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../form/errorMessage";

import { PeoplePicker } from "@microsoft/mgt-react";
import { Routes } from "../../common";

export const NewIncidentPage = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const getDefaultValues = () => {
        const result = {
            title: "",
            description: "",
            location: "",
            manager: "",
            members: [],
        };
        return result;
    };

    const { handleSubmit, getValues, setValue, register, watch, errors } = useForm({
        defaultValues: getDefaultValues(),
    });

    React.useEffect(() => {
        const validationRules = {
            title: {
                required: t("requiredValidationMessage"),
                maxLength: { value: 50, message: t("titleMaxLengthValidationMessage").replace("{n}", "50") },
            },
            manager: {
                required: t("requiredValidationMessage"),
            },
            location: {
                required: t("requiredValidationMessage"),
            },
            description: undefined,
            members: undefined,
        };

        register({ name: "title" }, validationRules.title);
        register({ name: "description" }, validationRules.description);
        register({ name: "location" }, validationRules.location);
        register({ name: "manager" }, validationRules.manager);
        register({ name: "members" }, validationRules.members);
    }, [getValues, register, t]);

    const { title, manager, location, members, description } = watch();

    const onConfirm = handleSubmit(async (data) => {
        try {
            console.log(data);
        } catch (ex) {}
    });

    const onManagerChange = (e: any) => {
        const result = e.detail && e.detail.length ? e.detail[0].id : undefined;
        setValue("manager", result, { shouldValidate: true });
    };

    const onMembersChange = (e: any) => {
        const result = e.detail && e.detail.length ? e.detail.map((x: any) => x.id) : undefined;
        setValue("members", result, { shouldValidate: true });
    };

    return (
        <Flex className={classes.container} column gap="gap.large">
            <Flex>
                <Breadcrumb aria-label="breadcrumb" size="large">
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href={Routes.home}>{t("homePageTitle")}</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Divider>
                        <ChevronEndIcon size="small" />
                    </Breadcrumb.Divider>
                    <Breadcrumb.Item active>{t("newIncidentPageTitle")}</Breadcrumb.Item>
                </Breadcrumb>
            </Flex>
            <Divider />
            <form onSubmit={onConfirm}>
                <Flex column gap="gap.medium">
                    <Flex column>
                        <Input
                            fluid
                            inverted
                            label={t("titleFieldLabel")}
                            value={title}
                            onChange={(ev: any, p) => {
                                setValue("title", p ? p.value : "", { shouldValidate: true });
                            }}
                        />
                        {!!errors.title && <ErrorMessage errorMessage={errors.title.message} />}
                    </Flex>
                    <Flex column>
                        <Text content={t("descriptionFieldLabel")} />
                        <TextArea
                            fluid
                            inverted
                            value={description}
                            rows={5}
                            onChange={(ev: any, p) => {
                                setValue("description", p ? p.value : "", { shouldValidate: true });
                            }}
                        />
                        {!!errors.description && <ErrorMessage errorMessage={errors.description.message} />}
                    </Flex>
                    <Flex column>
                        <Input
                            fluid
                            inverted
                            label={t("locationFieldLabel")}
                            value={location}
                            onChange={(ev: any, p) => {
                                setValue("location", p ? p.value : "", { shouldValidate: true });
                            }}
                        />
                        {!!errors.location && <ErrorMessage errorMessage={errors.location.message} />}
                    </Flex>
                    <Flex column>
                        <Text content={t("managerFieldLabel")} />
                        <PeoplePicker placeholder=" " selectionMode="single" selectionChanged={onManagerChange} />
                        {!!errors.manager && <ErrorMessage errorMessage={errors.manager.message} />}
                    </Flex>
                    <Flex column>
                        <Text content={t("teamMembersFieldLabel")} />
                        <PeoplePicker placeholder=" " showMax={25} selectionChanged={onMembersChange} />
                        {!!errors.members && <ErrorMessage errorMessage={(errors?.members as any).message} />}
                    </Flex>
                    <Flex gap="gap.medium">
                        <Button content={t("goBackBtnLabel")} type="button" />
                        <Button primary content={t("cancelBtnLabel")} type="submit" />
                    </Flex>
                </Flex>
            </form>
            <Divider />
        </Flex>
    );
};
