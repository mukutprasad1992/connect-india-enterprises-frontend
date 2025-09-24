import React, { useEffect, useState } from "react";
import InCompleteStepIcon, { CompleteStepIcon, InProgressStepIcon } from "./StepIcons";
import { Button, Grid, IconButton, Tooltip } from "@mui/material";

const steps = {
    personalDetails: 10,
    contactDetails: 10,
    employmentDetails: 10,
    referenceDetails: 10,
    documents: 10,
    review: 10,
};

export default function LoanStepProgress({ activeStep }: any) {

    const [stepsUpdate, setUpdateSteps] = useState(steps);

    function updateSteps(step: any) {
        const stepKeys = Object.keys(stepsUpdate);
        const activeIndex = stepKeys.indexOf(step);
        const updated: any = {};

        stepKeys.forEach((key: any, idx: number) => {
            if (idx <= activeIndex) {
                updated[key] = 30;
            } else if (idx === activeIndex + 1) {
                updated[key] = 20;
            } else {
                updated[key] = 10;
            }
        });

        return updated;
    }

    useEffect(() => {
        setUpdateSteps(updateSteps(activeStep));
    }, [activeStep]);

    return (
        <>
            <Grid container direction="row"
                spacing={0}
                alignItems="center">
                {
                    stepsUpdate.personalDetails === 30 ?
                        <Grid item>
                            <Tooltip title={stepsUpdate.personalDetails === 30 ? "Personal Details" : "Personal Details"}>
                                <IconButton sx={{ p: 0.2 }}>
                                    <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                </IconButton>
                            </Tooltip>
                        </Grid> :
                        (stepsUpdate.personalDetails === 20 ?
                            <Tooltip title={stepsUpdate.personalDetails === 20 ? "Personal Details" : "Personal Details"}>
                                <Grid item>
                                    <IconButton sx={{ p: 0.2 }} >
                                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton></Grid>
                            </Tooltip> :
                            <Tooltip title={stepsUpdate.personalDetails === 10 ? "Personal Details" : "Personal Details"}>
                                <Grid item>
                                    <IconButton sx={{ p: 0.2 }}>
                                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Grid>
                            </Tooltip>)
                }
                {
                    stepsUpdate.contactDetails === 30 ?
                        <Grid item>
                            <Tooltip title={stepsUpdate.contactDetails === 30 ? "Contact Details" : "Contact Details"}>
                                <IconButton sx={{ p: 0.2 }}>
                                    <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                </IconButton>
                            </Tooltip>
                        </Grid> :
                        (stepsUpdate.contactDetails === 20 ?
                            <Grid item>
                                <Tooltip title={stepsUpdate.contactDetails === 20 ? "Contact Details" : "Contact Details"}>
                                    <IconButton sx={{ p: 0.2 }}>
                                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid> :
                            <Grid item>
                                <Tooltip title={stepsUpdate.contactDetails === 10 ? "Contact Details" : "Contact Details"}>
                                    <IconButton sx={{ p: 0.2 }}>
                                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>)
                }
                {
                    stepsUpdate.employmentDetails === 30 ?
                        <Grid item>
                            <Tooltip title={stepsUpdate.employmentDetails === 30 ? "Employment Details" : "Employment Details"}>
                                <IconButton sx={{ p: 0.2 }}>
                                    <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                </IconButton>
                            </Tooltip>
                        </Grid> :
                        (stepsUpdate.employmentDetails === 20 ?
                            <Grid item>
                                <Tooltip title={stepsUpdate.employmentDetails === 20 ? "Employment Details" : "Employment Details"}>
                                    <IconButton sx={{ p: 0.2 }}>
                                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid> :
                            <Grid item>
                                <Tooltip title={stepsUpdate.employmentDetails === 10 ? "Employment Details" : "Employment Details"}>
                                    <IconButton sx={{ p: 0.2 }}>
                                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>)
                }
                {
                    stepsUpdate.referenceDetails === 30 ?
                        <Grid item>
                            <Tooltip title={stepsUpdate.referenceDetails === 30 ? "Reference Details" : "Reference Details"}>
                                <IconButton sx={{ p: 0.2 }}>
                                    <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                </IconButton>
                            </Tooltip>
                        </Grid> :
                        (stepsUpdate.referenceDetails === 20 ?
                            <Grid item>
                                <Tooltip title={stepsUpdate.referenceDetails === 20 ? "Reference Details" : "Reference Details"}>
                                    <IconButton sx={{ p: 0.2 }}>
                                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid> :
                            <Grid item>
                                <Tooltip title={stepsUpdate.referenceDetails === 10 ? "Reference Details" : "Reference Details"}>
                                    <IconButton sx={{ p: 0.2 }}>
                                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>)
                }
                {
                    stepsUpdate.documents === 30 ?
                        <Grid item>
                            <Tooltip title={stepsUpdate.documents === 30 ? "documents" : "documents"}>
                                <IconButton sx={{ p: 0.2 }}>
                                    <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                </IconButton>
                            </Tooltip>
                        </Grid> :
                        (stepsUpdate.documents === 20 ?
                            <Grid item>
                                <Tooltip title={stepsUpdate.documents === 20 ? "documents" : "documents"}>
                                    <IconButton sx={{ p: 0.2 }}>
                                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid> :
                            <Grid item>
                                <Tooltip title={stepsUpdate.documents === 10 ? "documents" : "documents"}>
                                    <IconButton sx={{ p: 0.2 }}>
                                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>)
                }
                {
                    stepsUpdate.review === 30 ?
                        <Grid item>
                            <Tooltip title={stepsUpdate.review === 30 ? "review" : "review"}>
                                <IconButton sx={{ p: 0.2 }}>
                                    <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                </IconButton>
                            </Tooltip>
                        </Grid> :
                        (stepsUpdate.review === 20 ?
                            <Grid item>
                                <Tooltip title={stepsUpdate.review === 20 ? "review" : "review"}>
                                    <IconButton sx={{ p: 0.2 }}>
                                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid> :
                            <Grid item>
                                <Tooltip title={stepsUpdate.review === 10 ? "review" : "review"}>
                                    <IconButton sx={{ p: 0.2 }}>
                                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>)
                }
            </Grid >

        </>

    )
}
