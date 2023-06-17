import request from "supertest";
import { app } from "../index";

describe('Login', () => {
    it('should return a token', async () => {
      const res = await request(app)
        .post('/login')
        .send({
            email: "admin@admin.com",
            password: "admin"
        })
      expect(res.statusCode).toEqual(200)
      //expect(res.body).toHaveProperty('token')
    })
    it('should explode', async () => {
      const res = await request(app)
        .post('/login')
        .send({
            email: "pinga@gmail.es",
            password: "jajaja"
        })
      expect(res.statusCode).toEqual(500)
    })
  })