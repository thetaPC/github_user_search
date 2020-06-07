<?php

namespace Drupal\github_user_search\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Github User Search Block - renders a simple search form.
 *
 * @Block(
 *   id = "github_user_search",
 *   admin_label = @Translation("Github User Search")
 * )
 */
class GithubUserSearchBlock extends BlockBase {

  /**
   * Constructs a new DefaultBlock object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param string $plugin_definition
   *   The plugin implementation definition.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    // Get the rendered version of the search form.
    $form = \Drupal::formBuilder()->getForm('Drupal\github_user_search\Form\GithubUserSearchForm');
    // Block markup.
    $block_theme = [
      '#theme' => 'github_user_search_form',
      '#cache' => ['max_age' => 0],
      '#item' => ['form' => $form],
    ];
    $markup = [
      '#type' => 'markup',
      '#markup' => \Drupal::service('renderer')->render($block_theme),
      '#attached' => [
        'library' => [
          'core/drupal',
          'core/drupal.ajax',
        ],
      ],
    ];
    return $markup;
  }

}
