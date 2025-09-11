import React, { useEffect, useState } from "react";
import InCompleteStepIcon, { CompleteStepIcon, InProgressStepIcon } from "./StepIcons";
import { Grid } from "@mui/material";

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
                spacing={0.5}
                alignItems="center">
                {
                    stepsUpdate.basicDetails === 30 ? <Grid item>
                        <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                    </Grid> : (stepsUpdate.basicDetails === 20 ? <Grid item>
                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} /></Grid> : <Grid item>
                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} /></Grid>)
                }
                {
                    stepsUpdate.personalDetails === 30 ? <Grid item>
                        <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                    </Grid> : (stepsUpdate.personalDetails === 20 ? <Grid item>
                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} /></Grid> : <Grid item>
                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} /></Grid>)
                }
                {
                    stepsUpdate.nomineeDetails === 30 ? <Grid item>
                        <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                    </Grid> : (stepsUpdate.nomineeDetails === 20 ? <Grid item>
                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} /></Grid> : <Grid item>
                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} /></Grid>)
                }
                {
                    stepsUpdate.documents === 30 ? <Grid item>
                        <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                    </Grid> : (stepsUpdate.documents === 20 ? <Grid item>
                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} /></Grid> : <Grid item>
                        <InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} /></Grid>)
                }
                {
                    stepsUpdate.review === 30 ? <Grid item>
                        <CompleteStepIcon sx={{ fontSize: 15, color: "green" }} />
                    </Grid> : (stepsUpdate.review === 20 ? <Grid item>
                        <InProgressStepIcon sx={{ fontSize: 15, color: "green" }} />
                    </Grid> : <Grid item><InCompleteStepIcon sx={{ fontSize: 15, color: "green" }} /></Grid>)
                }
            </Grid>

        </>

    )
}
