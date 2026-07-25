import { Router, type Request, type Response } from "express";

import {
  zEnrollmentBody
} from "../libs/zodValidators.js";

import type { Student, Course, Enrollment } from "../libs/types.js";

import { students, courses, enrollments } from "../db/db.js";

const router = Router();

router.delete("/enrollments", (req: Request, res: Response) => {
  try{
  const body = req.body as Enrollment;

    // validate req.body with predefined validator
    const result = zEnrollmentBody.safeParse(body); // check zod
    if (!result.success) {
      return res.status(400).json({
        ok: false,
        message: "Student Id must contain 9 characters"
      });
    }

    //check duplicate studentId
    const foundIndex = enrollments.findIndex(
      (student) => student.studentId === body.studentId && student.courseId === body.courseId
    );

    if (foundIndex === -1) {
      return res.status(404).json({
        ok: false,
        message: "Enrollment does not exist",
      });
    }
    students.splice(foundIndex,1)
    return res.status(200).json({
      ok: true,
      message: `Enrollment has been deleted`
    });


  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});
export default router;