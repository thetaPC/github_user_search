<?php

namespace Drupal\github_user_search\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\InvokeCommand;

/**
 * Implements a Github user search form.
 */
class GithubUserSearchForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'github_user_search';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    // Form wrapper.
    $form['#prefix'] = '<div id="github-user-search">';
    $form['#suffix'] = '</div>';
    $form['user'] = [
      '#type' => 'search',
      '#title' => $this->t('Enter a user'),
    ];
    $form['search'] = [
      '#type' => 'button',
      '#value' => $this->t('Search'),
      '#ajax' => [
        'callback' => [$this, 'searchUsers'],
        'event' => 'click',
        'progress' => [
          'type' => 'throbber',
          'message' => $this->t('Searching...'),
        ],
      ],
    ];
    // $form['actions']['#type'] = 'actions';
    // $form['actions']['submit'] = [
    //   '#type' => 'submit',
    //   '#value' => $this->t('Search'),
    //   '#button_type' => 'primary',
    //   '#ajax' => [
    //     'callback' => [$this, 'userSearch'],
    //     'event' => 'click',
    //     'progress' => [
    //       'type' => 'throbber',
    //       'message' => $this->t('Searching...'),
    //     ],
    //   ],
    // ];
    $form['#attached']['library'][] = 'github_user_search/user_search';
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    if (empty($form_state->getValue('user'))) {
      $form_state->setErrorByName('user', $this->t('Missing value.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // $this->messenger()->addStatus($this->t('Your term is @user', ['@user' => $form_state->getValue('user')]));
  }

  /**
   * An Ajax callback.
   */
  public function searchUsers(array &$form, FormStateInterface $form_state) {
    $response = new AjaxResponse();
    $response->addCommand(new InvokeCommand(NULL, 'user_search', [$form_state->getValue('user')]));
    // var_dump(\Drupal::request()->request->get('q'));
    return $response;
  }

}
