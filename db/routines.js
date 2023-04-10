const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try{
    const { rows: [routine] } = await client.query(
      `
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES($1, $2, $3, $4)
      RETURNING *;
      `,[creatorId, isPublic, name, goal]
    );return routine;
  } catch (error) {
    console.log("Error", error)
    alert(error)
   }
}

async function getRoutineById(routineId) {
  try {
    const { rows: [routines] } = await client.query(
      `
      SELECT*
      FROM routines
      WHERE 
      `,[routineId]
    );
    return routines;
  } catch(error) {
    console.log('Error', error)
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT*
      FROM routines           
      `
    );return routines;
  }catch (error){
    console.log("Error", error)
    alert('Error', error)
  }
}

async function getAllRoutines() {
  try {
  const { rows: routines } = await client.query(
  `
  SELECT*
  FROM routines
  `
    ); return routines;
  } catch (error){
    console.log("Error", error)
    alert('Error', error)
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: [routines] } = await client.query(
      `
      SELECT*
      FROM routines
      WHERE "isPublic":true 
      `
      ); return routines;
  } catch (error){
    console.log("Error", error)
    alert("Error", error)
  }
}


async function getAllRoutinesByUser({ username }) {
  try { 
  `
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId"=users.id
  WHERE username = $1
`, [username]
} catch (error) {
  console.log("Error", error)
  alert("Error", error)
}
}

async function getPublicRoutinesByUser({ username }) {
  try {
      const  { rows: routines } = await client.query(
    `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE username = $1 AND "isPublic" = true
    `, 
        [username]
  );
        return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log("Error", error)
    alert ("Error", error)
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(
    `
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routines."isPublic" = true
    AND routine_activities."activityId"=$1;
    `, [id]
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log("Error", error)
  }
}

async function updateRoutine({ id, ...fields }) {
 
    const setString = Object.keys(fields) 
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", "); 
  try{
    if (setString.length > 0){
      const {
        rows: [routine],
      } = await client.query(
        `
        UPDATE routines
        SET ${setString}
        WHERE id=${id}
        RETURNING*;
        `,
        Object.values(fields)
      );
      return routine;
    }
  } catch (error){
    console.log("Error", error)
    alert("Error", error)
  }
}

async function destroyRoutine(id) {
try {  
  await client.query( 
      
  `
  DELETE FROM routine_activities
  WHERE "rotuineId"= $1
  RETURNING*;
  `,[id]
)
} catch (error) {
  console.log("Error", error)
    alert("Error", error)
}
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
