import { badRequest, forbidden, notFound, serverError, unauthorized } from './components'
import { loginPath } from './paths'
import { surveyPath } from './paths/survey-path'
import {
  accountSchema,
  apiKeyAuthSchema,
  errorSchema,
  loginParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema
} from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Won Games Node API',
    description: 'API feita em nodejs baseado no curso do Rodrigo Manguinho',
    version: '1.0.0'
  },
  licence: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquetes'
  }],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    serverError,
    unauthorized,
    notFound,
    forbidden
  }
}
