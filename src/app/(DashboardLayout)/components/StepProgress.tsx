import React, { useEffect, useState } from "react";
import InCompleteStepIcon, { CompleteStepIcon, InProgressStepIcon } from "./StepIcons";
import { Button, Grid, IconButton, Tooltip } from "@mui/material";

const steps = {
    basicDetails: 10,
    personalDetails: 10,
    nomineeDetails: 10,
    documents: 10,
    review: 10,
};

export default function StepProgress({ activeStep }: any) {

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
                    stepsUpdate.basicDetails === 30 ?
                        <Grid item>
                            <Tooltip title={stepsUpdate.basicDetails === 30 ? "Basic Details" : "Basic Details"}>
                                <IconButton sx={{ p: 0.1 }}>
                                    <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                </IconButton>
                            </Tooltip>
                        </Grid> :
                        (stepsUpdate.basicDetails === 20 ?
                            <Tooltip title={stepsUpdate.basicDetails === 20 ? "Basic Details" : "Basic Details"}>
                                <Grid item>
                                    <IconButton sx={{ p: 0.1 }} >
                                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton></Grid>
                            </Tooltip> :
                            <Tooltip title={stepsUpdate.basicDetails === 10 ? "Basic Details" : "Basic Details"}>
                                <Grid item>
                                    <IconButton sx={{ p: 0.1 }}>
                                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Grid>
                            </Tooltip>)
                }
                {
                    stepsUpdate.personalDetails === 30 ?
                        <Grid item>
                            <Tooltip title={stepsUpdate.personalDetails === 30 ? "Personal Details" : "personal Details"}>
                                <IconButton sx={{ p: 0.1 }}>
                                    <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                </IconButton>
                            </Tooltip>
                        </Grid> :
                        (stepsUpdate.personalDetails === 20 ?
                            <Grid item>
                                <Tooltip title={stepsUpdate.personalDetails === 20 ? "Personal Details" : "personal Details"}>
                                    <IconButton sx={{ p: 0.1 }}>
                                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid> :
                            <Grid item>
                                <Tooltip title={stepsUpdate.personalDetails === 10 ? "Personal Details" : "personal Details"}>
                                    <IconButton sx={{ p: 0.1 }}>
                                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>)
                }
                {
                    stepsUpdate.nomineeDetails === 30 ?
                        <Grid item>
                            <Tooltip title={stepsUpdate.nomineeDetails === 30 ? "Nominee Details" : "Nominee Details"}>
                                <IconButton sx={{ p: 0.1 }}>
                                    <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                </IconButton>
                            </Tooltip>
                        </Grid> :
                        (stepsUpdate.nomineeDetails === 20 ?
                            <Grid item>
                                <Tooltip title={stepsUpdate.nomineeDetails === 20 ? "Nominee Details" : "Nominee Details"}>
                                    <IconButton sx={{ p: 0.1 }}>
                                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid> :
                            <Grid item>
                                <Tooltip title={stepsUpdate.nomineeDetails === 10 ? "Nominee Details" : "Nominee Details"}>
                                    <IconButton sx={{ p: 0.1 }}>
                                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>)
                }
                {
                    stepsUpdate.documents === 30 ?
                        <Grid item>
                            <Tooltip title={stepsUpdate.documents === 30 ? "documents" : "documents"}>
                                <IconButton sx={{ p: 0.1 }}>
                                    <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                </IconButton>
                            </Tooltip>
                        </Grid> :
                        (stepsUpdate.documents === 20 ?
                            <Grid item>
                                <Tooltip title={stepsUpdate.documents === 20 ? "documents" : "documents"}>
                                    <IconButton sx={{ p: 0.1 }}>
                                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid> :
                            <Grid item>
                                <Tooltip title={stepsUpdate.documents === 10 ? "documents" : "documents"}>
                                    <IconButton sx={{ p: 0.1 }}>
                                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>)
                }
                {
                    stepsUpdate.review === 30 ?
                        <Grid item>
                            <Tooltip title={stepsUpdate.review === 30 ? "review" : "review"}>
                                <IconButton sx={{ p: 0.1 }}>
                                    <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                </IconButton>
                            </Tooltip>
                        </Grid> :
                        (stepsUpdate.review === 20 ?
                            <Grid item>
                                <Tooltip title={stepsUpdate.review === 20 ? "review" : "review"}>
                                    <IconButton sx={{ p: 0.1 }}>
                                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid> :
                            <Grid item>
                                <Tooltip title={stepsUpdate.review === 10 ? "review" : "review"}>
                                    <IconButton sx={{ p: 0.1 }}>
                                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>)
                }
            </Grid >

        </>

    )
}
